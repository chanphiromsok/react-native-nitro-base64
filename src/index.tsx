import { NitroModules } from 'react-native-nitro-modules';
import type { NitroBase64 } from './NitroBase64.nitro';

const NitroBase64HybridObject =
  NitroModules.createHybridObject<NitroBase64>('NitroBase64');

// const NitroBase64ModuleHybridObject =
//   NitroModules.createHybridObject<NitroBase64Module>('NitroBase64Module');
export function decode(base64: string): string {
  return NitroBase64HybridObject.decode(base64);
}

export function encode(input: string, urlSafe = false): string {
  return NitroBase64HybridObject.encode(input, urlSafe);
}

export function decodeBuffer(base64: string): ArrayBuffer {
  return NitroBase64HybridObject.decodeBuffer(base64);
}

export function encodeBuffer(input: ArrayBuffer, urlSafe = false): string {
  return NitroBase64HybridObject.encodeBuffer(input, urlSafe);
}

export function fromByteArray(input: Uint8Array, urlSafe = false): string {
  return NitroBase64HybridObject.encodeBuffer(
    input.buffer as ArrayBuffer,
    urlSafe
  );
}

export function toByteArray(base64: string): Uint8Array {
  return new Uint8Array(NitroBase64HybridObject.decodeBuffer(base64));
}

export function install(): void {
  NitroBase64HybridObject.install();
}
export default NitroBase64HybridObject;
