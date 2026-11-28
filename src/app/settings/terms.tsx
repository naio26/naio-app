import { Card, Screen, ScreenHeader, Txt } from '@/components';
import { space } from '@/theme';

// Placeholder until the owner provides the real Terms and Privacy texts.
export default function Terms() {
  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Account" title="Terms & privacy" />}
      contentStyle={{ paddingTop: space.xl, gap: space.lg }}
    >
      <Card tone="muted" style={{ padding: 20 }}>
        <Txt>The full Terms and Safety Guidelines will appear here.</Txt>
      </Card>
      <Txt variant="h2">In short</Txt>
      <Txt>• naio is for meeting people in real life through small plans. It’s not a dating app.</Txt>
      <Txt>• Everyone is age-verified. Others only see your age range, never your exact age or your ID.</Txt>
      <Txt>• Your exact location is never shown. Meeting points are shared only with accepted people.</Txt>
      <Txt>• Plans and their chats disappear after they happen.</Txt>
    </Screen>
  );
}
