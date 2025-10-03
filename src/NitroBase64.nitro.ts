import type { HybridObject } from 'react-native-nitro-modules';

export interface NitroBase64
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  install(): void;
  encode(input: string, urlSafe: boolean): string;
  decode(base64: string, urlSafe: boolean): string;
}

// export interface NitroBase64Module extends HybridObject<{ android: 'kotlin' }> {
//   install(): void;
// }
