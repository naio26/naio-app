import { Redirect } from 'expo-router';
import { useProfile } from '@/state/profile';
import { useSession } from '@/state/session';

// Where the app opens: the map once your profile is created, otherwise always the intro reel
// (even if you had signed in), so the whole flow can be followed again and every back button has a screen to go to.
export default function Index() {
  const { account } = useSession();
  const { created } = useProfile();
  if (account && created) return <Redirect href="/map" />;
  return <Redirect href="/reel" />;
}
