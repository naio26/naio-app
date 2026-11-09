import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { MIN_INTERESTS } from '@/data/catalog';
import { DocType, MyProfile } from '@/data/types';

/** An ID photo taken or uploaded during the age check (never shown to other people). */
export type IdPhoto = { source: 'camera' | 'upload' } | null;

type ProfileState = {
  profile: MyProfile;
  update: (changes: Partial<MyProfile>) => void;
  /** Age check in progress (screens 12–15). */
  docType: DocType;
  setDocType: (doc: DocType) => void;
  idPhoto: IdPhoto;
  setIdPhoto: (photo: IdPhoto) => void;
  /** Profile saved with "Create profile" (screen 20). */
  created: boolean;
  setCreated: (created: boolean) => void;
  /** What is still missing before the profile can be created (screen 09). */
  missing: string[];
};

const empty: MyProfile = {
  photoChecked: false,
  firstName: '',
  ageVerified: false,
  languages: [],
  interests: [],
  from: '',
  about: '',
};

const ProfileContext = createContext<ProfileState | null>(null);

/** Your own profile while you set it up. In memory only for now (Supabase later). */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<MyProfile>(empty);
  const [docType, setDocType] = useState<DocType>('National ID');
  const [idPhoto, setIdPhoto] = useState<IdPhoto>(null);
  const [created, setCreated] = useState(false);

  const update = useCallback((changes: Partial<MyProfile>) => setProfile((p) => ({ ...p, ...changes })), []);

  const value = useMemo(() => {
    const missing: string[] = [];
    if (!profile.photoChecked) missing.push('photo');
    if (!profile.firstName.trim()) missing.push('first name');
    if (!profile.ageVerified) missing.push('verified age range');
    if (profile.languages.length === 0) missing.push('languages');
    if (profile.interests.length < MIN_INTERESTS) missing.push('interests');
    return { profile, update, docType, setDocType, idPhoto, setIdPhoto, created, setCreated, missing };
  }, [profile, update, docType, idPhoto, created]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
