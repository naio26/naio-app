import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, BackButton, Txt } from '@/components';
import { formatTime, planWhen, startsIn } from '@/data/time';
import { Message, Person } from '@/data/types';
import { useChat } from '@/state/chat';
import { usePeople } from '@/state/people';
import { usePlan, usePlans } from '@/state/plans';
import { colors, fonts, icon, radius, space } from '@/theme';

// Screen 38 — the temporary group chat. Locked until the host accepts you; gone after the plan.
export default function PlanChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  const { statusOf, membersOf } = usePlans();
  const { messagesOf, load, send } = useChat();
  const memberIds = plan ? membersOf(plan) : [];
  const people = usePeople(plan ? [...new Set([...memberIds, plan.hostId])] : []);
  const [text, setText] = useState('');
  const scroll = useRef<ScrollViewInstance>(null);
  const messages = messagesOf(id);
  const status = plan ? statusOf(plan) : 'none';
  const open = status === 'accepted' || status === 'host';

  useEffect(() => {
    if (open && !messages) load(id);
  }, [open, messages, load, id]);

  if (!plan) return <SafeAreaView style={styles.root} />;
  const host = people.find((p) => p.id === plan.hostId);
  const byId = (pid: string): Person | undefined => people.find((p) => p.id === pid);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    setText('');
    send(id, t, memberIds);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton />
        <View style={{ flex: 1, gap: 4 }}>
          <Txt style={styles.title} numberOfLines={1}>
            {plan.title}
          </Txt>
          <View style={styles.meta}>
            <View style={styles.dot} />
            <Txt variant="small" numberOfLines={1} style={{ flex: 1 }}>
              {memberIds.length} going · {planWhen(plan).replace(' · ', ' ')} · {plan.language}
            </Txt>
          </View>
        </View>
      </View>

      {!open ? (
        <View style={styles.locked}>
          <Icon name="lock" size={icon.hero} color={colors.accent} />
          <Txt variant="h2" center>
            Chat locked
          </Txt>
          <Txt center>
            {status === 'requested'
              ? `The chat unlocks once ${host?.firstName ?? 'the host'} accepts your request.`
              : 'Join the plan to chat. The chat unlocks once the host accepts you.'}
          </Txt>
        </View>
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            ref={scroll}
            contentContainerStyle={styles.list}
            onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.pinned}>
              <Icon name="map-pin" color={colors.dark} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="label">{plan.exactPoint}</Txt>
                <Txt variant="caption">{startsIn(plan)} · exact meeting point confirmed</Txt>
              </View>
            </View>
            <View style={styles.dayPill}>
              <Txt variant="caption">{plan.day === 'today' ? 'Today' : 'Tomorrow'}</Txt>
            </View>
            {(messages ?? []).map((m, i, all) => (
              <Bubble key={m.id} m={m} author={byId(m.authorId)} showName={all[i - 1]?.authorId !== m.authorId} />
            ))}
          </ScrollView>

          <Txt variant="caption" center style={{ marginBottom: 6 }}>
            This chat disappears after the plan ends.
          </Txt>
          <View style={styles.inputBar}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Say something…"
              placeholderTextColor={colors.faint}
              style={styles.input}
              onSubmitEditing={submit}
              returnKeyType="send"
              maxLength={500}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send"
              onPress={submit}
              disabled={!text.trim()}
              style={[styles.send, !text.trim() && { backgroundColor: colors.disabled }]}
            >
              <Icon name="arrow-up" color={colors.white} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

function Bubble({ m, author, showName }: { m: Message; author?: Person; showName: boolean }) {
  const time = formatTime(m.time).toLowerCase();
  if (m.authorId === 'system') {
    return (
      <Txt variant="small" center style={styles.system}>
        {m.text}
      </Txt>
    );
  }
  if (m.authorId === 'me') {
    return (
      <View style={styles.mine}>
        {showName && <Txt style={styles.stamp}>You · {time}</Txt>}
        <View style={[styles.bubble, styles.bubbleMine]}>
          <Txt style={[styles.bubbleText, { color: colors.white }]}>{m.text}</Txt>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.theirs}>
      <View style={{ width: 38 }}>
        {showName && author && <Avatar initials={author.initials} size={38} color={author.avatarColor} serif />}
      </View>
      <View style={{ flex: 1, alignItems: 'flex-start', gap: 4 }}>
        {showName && (
          <Txt style={styles.stamp}>
            {author?.firstName ?? 'Someone'} · {time}
          </Txt>
        )}
        <View style={styles.bubble}>
          <Txt style={styles.bubbleText}>{m.text}</Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30, color: colors.dark },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  list: { padding: space.lg, gap: 10 },
  pinned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.mist,
  },
  dayPill: {
    alignSelf: 'center',
    backgroundColor: colors.mist,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginVertical: 6,
  },
  system: { marginVertical: 6 },
  theirs: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginRight: 40 },
  mine: { alignItems: 'flex-end', gap: 4, marginLeft: 60 },
  stamp: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  bubble: { backgroundColor: colors.mist, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 11 },
  bubbleMine: { backgroundColor: colors.accentFill },
  bubbleText: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 22, color: colors.dark },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: space.lg,
    marginBottom: space.sm,
    padding: 6,
    paddingLeft: 18,
    borderRadius: 26,
    backgroundColor: colors.mist,
  },
  input: { flex: 1, fontFamily: fonts.sans, fontSize: 16, color: colors.dark, paddingVertical: 10 },
  send: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.accentFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: space.gutter },
});
