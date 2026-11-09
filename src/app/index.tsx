import { Redirect } from 'expo-router';

// The app always opens on the intro reel for now (there is no saved login yet).
export default function Index() {
  return <Redirect href="/reel" />;
}
