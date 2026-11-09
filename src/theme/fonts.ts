import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { DMSans_800ExtraBold } from '@expo-google-fonts/dm-sans/800ExtraBold';
import { SourceSerif4_400Regular } from '@expo-google-fonts/source-serif-4/400Regular';
import { SourceSerif4_600SemiBold } from '@expo-google-fonts/source-serif-4/600SemiBold';

// Passed to useFonts() in the root layout.
export const fontAssets = {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  DMSans_800ExtraBold,
  SourceSerif4_400Regular,
  SourceSerif4_600SemiBold,
};

export const fonts = {
  serif: 'SourceSerif4_400Regular',
  serifBold: 'SourceSerif4_600SemiBold',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansBold: 'DMSans_700Bold',
  sansBlack: 'DMSans_800ExtraBold',
} as const;
