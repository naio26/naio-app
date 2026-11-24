import { City } from '../types';

/** The demo always runs in Athens. Later this comes from the user's real location. */
export const demoCity: City = {
  name: 'Athens',
  country: 'Greece',
  languages: ['EL', 'EN'],
  // Neighbourhoods offered as a plan's area. Later they come with the user's real city.
  areas: [
    { name: 'Monastiraki', location: { latitude: 37.9761, longitude: 23.7257 } },
    { name: 'Plaka', location: { latitude: 37.9722, longitude: 23.7296 } },
    { name: 'Syntagma', location: { latitude: 37.9755, longitude: 23.7348 } },
    { name: 'Psyrri', location: { latitude: 37.9779, longitude: 23.7236 } },
    { name: 'Thiseio', location: { latitude: 37.9765, longitude: 23.7185 } },
    { name: 'Koukaki', location: { latitude: 37.9643, longitude: 23.7247 } },
    { name: 'Kolonaki', location: { latitude: 37.9794, longitude: 23.7426 } },
  ],
};
