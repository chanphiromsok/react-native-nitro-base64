import { NitroModules } from 'react-native-nitro-modules';
import type { NitroBase64 } from './NitroBase64.nitro';

const NitroBase64HybridObject =
  NitroModules.createHybridObject<NitroBase64>('NitroBase64');

export function decode(base64: string): string {
  return NitroBase64HybridObject.decode(base64);
}

export function encode(input: string): string {
  return NitroBase64HybridObject.encode(input);
}
export function base64FromArrayBuffer(arrayBuffer: string): string {
  return NitroBase64HybridObject.base64FromArrayBuffer(arrayBuffer, true);
}
export function base64ToArrayBuffer(base64String: string): string {
  return NitroBase64HybridObject.base64ToArrayBuffer(base64String, false);
}
export default NitroBase64HybridObject;
