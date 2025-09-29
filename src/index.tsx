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

export default NitroBase64HybridObject;
