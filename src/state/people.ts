import { listPeople } from '@/data/api';
import { useLoad } from '@/data/hooks';
import { AGE_RANGES, Person } from '@/data/types';
import { useProfile } from './profile';

/** You, shaped like everyone else, so you can appear in member lists. */
export function useMe(): Person {
  const { profile } = useProfile();
  const name = profile.firstName.trim() || 'You';
  return {
    id: 'me',
    firstName: name,
    initials: name.charAt(0).toUpperCase(),
    ageRange: profile.ageRange ?? AGE_RANGES[0],
    verified: profile.ageVerified,
    from: profile.from,
    situation: profile.situation,
    about: profile.about,
    interests: profile.interests,
    languages: profile.languages,
  };
}

/** People by id, in the same order. "me" is you. */
export function usePeople(ids: string[]): Person[] {
  const me = useMe();
  const others = useLoad(() => listPeople(ids.filter((id) => id !== 'me')), [ids.join(',')]) ?? [];
  return ids.map((id) => (id === 'me' ? me : others.find((p) => p.id === id))).filter((p): p is Person => !!p);
}
