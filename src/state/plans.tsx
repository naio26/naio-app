import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  answerJoinRequest,
  cancelJoinRequest,
  cancelPlan as apiCancelPlan,
  createPlan as apiCreatePlan,
  getPlan,
  listJoinRequests,
  listMyJoinedPlans,
  listPeople,
  listPlans,
  removeFromPlan,
  requestToJoin,
  updatePlan as apiUpdatePlan,
  waitForHostReply,
} from '@/data/api';
import { useLoad } from '@/data/hooks';
import { JoinRequest, JoinStatus, Plan, PlanDraft } from '@/data/types';
import { useAlerts } from './alerts';
import { useChat } from './chat';
import { KEYS, useSaved } from './storage';

/** Your relation to a plan: 'host' for your own plans, otherwise none → requested → accepted. */
export type MyStatus = JoinStatus | 'host';

type PlansState = {
  plans: Plan[]; // every plan that is still on
  loaded: boolean;
  statusOf: (plan: Plan) => MyStatus;
  /** Member ids as you see them, plus you once accepted. */
  membersOf: (plan: Plan) => string[];
  requestJoin: (planId: string) => Promise<void>;
  cancelRequest: (planId: string) => Promise<void>;
  removeMember: (planId: string, personId: string) => Promise<void>;
  /** People asking to join YOUR plans. */
  requests: JoinRequest[];
  answerRequest: (id: string, accept: boolean) => Promise<void>;
  createPlan: (d: PlanDraft) => Promise<Plan>;
  updatePlan: (id: string, d: PlanDraft) => Promise<void>;
  cancelPlan: (id: string) => Promise<void>;
};

const PlansContext = createContext<PlansState | null>(null);

/** Your join statuses, saved on the phone. */
export type SavedPlans = Record<string, JoinStatus>;

/** All plans, your joins and requests to your plans. Saved on the phone (statuses here, the rest in api.ts). */
export function PlansProvider({ children, initial }: { children: ReactNode; initial?: SavedPlans }) {
  const alerts = useAlerts();
  const chat = useChat();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Record<string, JoinStatus>>(initial ?? {});
  useSaved(KEYS.plans, status);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  // Latest statuses for the async host reply below (state inside it would be stale).
  const latest = useRef(status);
  latest.current = status;
  // After "Reset demo" this store is replaced: late replies must not touch it.
  const alive = useRef(true);
  useEffect(
    () => () => {
      alive.current = false;
    },
    [],
  );

  const refresh = useCallback(async () => {
    setPlans(await listPlans());
    setLoaded(true);
  }, []);

  // Demo: the host accepts a few seconds after your request, unless you cancelled meanwhile.
  const awaitHost = useCallback(
    (planId: string) => {
      waitForHostReply(planId).then(async (reply) => {
        if (!reply || !alive.current || latest.current[planId] !== 'requested') return;
        setStatus((s) => ({ ...s, [planId]: reply.status }));
        const plan = await getPlan(planId);
        const [host] = plan ? await listPeople([plan.hostId]) : [];
        chat.addSystem(planId, 'You joined the plan');
        alerts.add({
          kind: 'accepted',
          title: `${host?.firstName ?? 'The host'} accepted your request`,
          subtitle: plan?.title ?? '',
          planId,
          personId: host?.id,
        });
      });
    },
    [alerts, chat],
  );

  useEffect(() => {
    refresh();
    listJoinRequests().then(setRequests);
    if (initial) {
      // Reopening the app while a request was waiting: the host answers again a few seconds later.
      Object.entries(initial)
        .filter(([, st]) => st === 'requested')
        .forEach(([id]) => awaitHost(id));
    } else {
      // First start: the plans you're already in.
      listMyJoinedPlans().then((ids) =>
        setStatus((s) => ({ ...Object.fromEntries(ids.map((id) => [id, 'accepted'])), ...s })),
      );
    }
    // Only once, when the app starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestJoin = useCallback(
    async (planId: string) => {
      const res = await requestToJoin(planId);
      setStatus((s) => ({ ...s, [planId]: res.status }));
      awaitHost(planId);
    },
    [awaitHost],
  );

  const cancelRequest = useCallback(async (planId: string) => {
    setStatus((s) => ({ ...s, [planId]: 'none' }));
    await cancelJoinRequest(planId);
  }, []);

  const removeMember = useCallback(
    async (planId: string, personId: string) => {
      await removeFromPlan(planId, personId);
      await refresh();
    },
    [refresh],
  );

  const answerRequest = useCallback(
    async (id: string, accept: boolean) => {
      const r = await answerJoinRequest(id, accept);
      setRequests((list) => list.map((x) => (x.id === id ? r : x)));
      await refresh();
      if (accept) await chat.load(r.planId);
    },
    [refresh, chat],
  );

  const createPlan = useCallback(
    async (d: PlanDraft) => {
      const plan = await apiCreatePlan(d);
      await refresh();
      return plan;
    },
    [refresh],
  );

  const updatePlan = useCallback(
    async (id: string, d: PlanDraft) => {
      await apiUpdatePlan(id, d);
      await refresh();
    },
    [refresh],
  );

  const cancelPlan = useCallback(
    async (id: string) => {
      await apiCancelPlan(id);
      setRequests((list) => list.filter((r) => r.planId !== id));
      await refresh();
    },
    [refresh],
  );

  const value = useMemo<PlansState>(
    () => ({
      plans,
      loaded,
      statusOf: (plan) => (plan.hostId === 'me' ? 'host' : (status[plan.id] ?? 'none')),
      membersOf: (plan) =>
        status[plan.id] === 'accepted' && !plan.memberIds.includes('me') ? [...plan.memberIds, 'me'] : plan.memberIds,
      requestJoin,
      cancelRequest,
      removeMember,
      requests,
      answerRequest,
      createPlan,
      updatePlan,
      cancelPlan,
    }),
    [
      plans,
      loaded,
      status,
      requestJoin,
      cancelRequest,
      removeMember,
      requests,
      answerRequest,
      createPlan,
      updatePlan,
      cancelPlan,
    ],
  );

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>;
}

export function usePlans() {
  const ctx = useContext(PlansContext);
  if (!ctx) throw new Error('usePlans must be used inside <PlansProvider>');
  return ctx;
}

/** One plan by id. Falls back to asking api.ts (e.g. for a plan you just cancelled). */
export function usePlan(id: string): Plan | undefined {
  const { plans } = usePlans();
  const live = plans.find((p) => p.id === id);
  const fetched = useLoad(() => (live ? Promise.resolve(undefined) : getPlan(id)), [id, !!live]);
  return live ?? fetched;
}
