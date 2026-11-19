import { Redirect } from 'expo-router';
import { useProfile } from '@/state/profile';
import { useSafety } from '@/state/safety';
import { useSession } from '@/state/session';

// Where the app opens: the map once your profile is created, otherwise always the intro reel
// (even if you had signed in), so the whole flow can be followed again and every back button has a screen to go to.
// naio needs location: with a profile but no location allowed, it opens "You're all set" (asks, or the blocking screen).
export default function Index() {
  const { account } = useSession();
  const { created } = useProfile();
  const { locationAccess } = useSafety();
  if (account && created) return <Redirect href={locationAccess === 'granted' ? '/map' : '/setup/welcome'} />;
  return <Redirect href="/reel" />;
}
