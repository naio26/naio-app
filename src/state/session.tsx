import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Account } from '@/data/types';
import { KEYS, useSaved } from './storage';

type Session = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
};

const SessionContext = createContext<Session | null>(null);

/** Who is signed in. Saved on the phone, so a reload doesn't send you back to the intro. */
export function SessionProvider({ children, initial }: { children: ReactNode; initial?: Account | null }) {
  const [account, setAccount] = useState<Account | null>(initial ?? null);
  useSaved(KEYS.session, account);
  const value = useMemo(() => ({ account, setAccount }), [account]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
