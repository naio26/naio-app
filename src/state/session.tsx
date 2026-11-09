import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Account } from '@/data/types';

type Session = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
};

const SessionContext = createContext<Session | null>(null);

/** Who is signed in. Kept in memory only, so reloading the app starts again at the reel. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const value = useMemo(() => ({ account, setAccount }), [account]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
