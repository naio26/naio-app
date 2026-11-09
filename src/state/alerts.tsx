import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addNotice, listNotices, markNoticeRead } from '@/data/api';
import { Notice } from '@/data/types';

type AlertsState = {
  notices: Notice[];
  unread: number;
  add: (n: Omit<Notice, 'id' | 'read' | 'minutesAgo'>) => Promise<void>;
  markRead: (id: string) => void;
};

const AlertsContext = createContext<AlertsState | null>(null);

/** The Alerts tab (39). Fake: nothing is pushed to the phone, alerts only live inside the app. */
export function AlertsProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    listNotices().then(setNotices);
  }, []);

  const add = useCallback(async (n: Omit<Notice, 'id' | 'read' | 'minutesAgo'>) => {
    const notice = await addNotice(n);
    setNotices((list) => [notice, ...list]);
  }, []);

  const markRead = useCallback((id: string) => {
    markNoticeRead(id);
    setNotices((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const value = useMemo(
    () => ({ notices, unread: notices.filter((n) => !n.read).length, add, markRead }),
    [notices, add, markRead],
  );
  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used inside <AlertsProvider>');
  return ctx;
}
