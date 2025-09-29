import type { HybridObject } from 'react-native-nitro-modules';

export interface NitroBase64
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  encode(input: string): string;
  decode(base64: string): string;
  base64FromArrayBuffer(arrayBuffer: string, urlSafe: boolean): string;
  base64ToArrayBuffer(base64String: string, removeLinebreaks: boolean): string;
}
