import { JoinRequest, Message, Notice, PastPlan } from '../types';

/** Leo wants to join your plan (screens 39–41). */
export const requests: JoinRequest[] = [
  { id: 'req-leo', planId: 'coffee-wander', personId: 'leo', status: 'pending', minutesAgo: 2 },
];

/** Plans you're already in when the demo starts (besides your own). */
export const joinedAtStart = ['philopappou-walk'];

export const messages: Message[] = [
  // Sunset drinks (screen 38) — readable once Nora accepts you.
  { id: 'm1', planId: 'sunset-drinks', authorId: 'maya', text: 'Hey! I’ll bring a bottle of wine 🍷', time: '16:08' },
  { id: 'm2', planId: 'sunset-drinks', authorId: 'leo', text: 'Perfect. I’m about 20 mins away.', time: '16:10' },
  { id: 'm3', planId: 'sunset-drinks', authorId: 'system', text: 'Jonas joined the plan', time: '16:12' },
  {
    id: 'm4',
    planId: 'sunset-drinks',
    authorId: 'jonas',
    text: 'Hi everyone! Is the entrance easy to spot?',
    time: '16:16',
  },
  // Morning walk on Philopappou — you're already in.
  {
    id: 'm5',
    planId: 'philopappou-walk',
    authorId: 'sofia',
    text: 'Morning crew! Bring water, it gets warm up there ☀️',
    time: '15:40',
  },
  { id: 'm6', planId: 'philopappou-walk', authorId: 'leo', text: 'I’ll be there 10 min early.', time: '15:52' },
  { id: 'm7', planId: 'philopappou-walk', authorId: 'sofia', text: 'See you by the little church!', time: '16:10' },
  // Your plan.
  { id: 'm8', planId: 'coffee-wander', authorId: 'maya', text: 'Count me in for the wander part!', time: '15:30' },
  { id: 'm9', planId: 'coffee-wander', authorId: 'nora', text: 'Is there a good freddo place nearby?', time: '15:45' },
];

export const notices: Notice[] = [
  {
    id: 'n1',
    kind: 'join-request',
    title: 'Leo asked to join your plan',
    subtitle: 'Coffee and a wander?',
    minutesAgo: 2,
    read: false,
    personId: 'leo',
    planId: 'coffee-wander',
    requestId: 'req-leo',
  },
  {
    id: 'n2',
    kind: 'message',
    title: 'New message from Sofia',
    subtitle: 'Morning walk on Philopappou',
    minutesAgo: 8,
    read: false,
    personId: 'sofia',
    planId: 'philopappou-walk',
  },
  {
    id: 'n3',
    kind: 'match',
    title: 'A new nearby plan matches you',
    subtitle: 'Freddo in Koukaki',
    minutesAgo: 18,
    read: true,
    planId: 'freddo-koukaki',
  },
];

export const pastPlans: PastPlan[] = [
  {
    id: 'past-glyfada',
    title: 'Beach walk at Glyfada',
    area: 'Glyfada',
    when: 'Yesterday',
    people: ['Maya', 'Nora', 'Leo', 'Sofia', 'Jonas'],
  },
];

/** Quick replies other members "send" after you write in a chat (demo only). */
export const autoReplies = [
  'Sounds good!',
  'See you there 🙌',
  'Perfect 👌',
  'Can’t wait!',
  'Haha yes',
  'On my way soon',
];
