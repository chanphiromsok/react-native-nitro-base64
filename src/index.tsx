import { NitroModules } from 'react-native-nitro-modules';
import type { NitroBase64 } from './NitroBase64.nitro';

const NitroBase64HybridObject =
  NitroModules.createHybridObject<NitroBase64>('NitroBase64');

export function multiply(a: number, b: number): number {
  return NitroBase64HybridObject.multiply(a, b);
}
