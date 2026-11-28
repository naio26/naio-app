import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { addSystemMessage, listMessages, sendMessage, waitForReply } from '@/data/api';
import { Message } from '@/data/types';

type ChatState = {
  messagesOf: (planId: string) => Message[] | undefined;
  load: (planId: string) => Promise<void>;
  send: (planId: string, text: string, memberIds: string[]) => Promise<void>;
  addSystem: (planId: string, text: string) => Promise<void>;
};

const ChatContext = createContext<ChatState | null>(null);

/** Temporary plan chats (38). Fake: other members answer by themselves a moment after you write. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [byPlan, setByPlan] = useState<Record<string, Message[]>>({});

  const append = useCallback((m: Message) => {
    setByPlan((all) => ({ ...all, [m.planId]: [...(all[m.planId] ?? []), m] }));
  }, []);

  const load = useCallback(async (planId: string) => {
    const list = await listMessages(planId);
    setByPlan((all) => ({ ...all, [planId]: list }));
  }, []);

  const send = useCallback(
    async (planId: string, text: string, memberIds: string[]) => {
      append(await sendMessage(planId, text));
      const reply = await waitForReply(planId, memberIds);
      if (reply) append(reply);
    },
    [append],
  );

  const addSystem = useCallback(
    async (planId: string, text: string) => {
      await addSystemMessage(planId, text);
      await load(planId); // the full history, including the new line
    },
    [load],
  );

  const value = useMemo(
    () => ({ messagesOf: (id: string) => byPlan[id], load, send, addSystem }),
    [byPlan, load, send, addSystem],
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}
