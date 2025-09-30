# NitroBase64

A high-performance, cross-platform Base64 encoding/decoding module for React Native, powered by C++ and simdutf. Implements WHATWG forgiving-base64 and supports both standard and URL-safe variants.

## Features
- Fast C++ implementation using [simdutf](https://github.com/simdutf/simdutf)
- WHATWG forgiving-base64 compliance (removes whitespace, optional padding)
- Supports both standard and URL-safe base64
- Consistent API for iOS and Android
- Detailed error handling

## Installation

```sh
yarn add react-native-nitro-base64
```

### Linking
This module uses [react-native-nitro-modules](https://github.com/mrousavy/nitro). Follow Nitro's setup instructions for autolinking and native builds.

## API

```typescript
export interface NitroBase64 extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  encode(input: string, urlSafe: boolean): string;
  decode(base64: string, urlSafe: boolean): string;
}
```

- `encode(input: string, urlSafe: boolean): string` — Encodes binary data to base64. Set `urlSafe` to `true` for base64url encoding.
- `decode(base64: string, urlSafe: boolean): string` — Decodes base64 (WHATWG forgiving) to binary. Set `urlSafe` to `true` for base64url decoding.

## Usage

```typescript
import { encode,decode } from 'react-native-nitro-base64';

const encoded = encode('Hello World!', false); // "SGVsbG8gV29ybGQh"
const urlEncoded = encode('Hello World!', true); // "SGVsbG8gV29ybGQh"

const decoded = decode(encoded, false); // "Hello World!"
const urlDecoded = decode(urlEncoded, true); // "Hello World!"
```

## Platform Support
- **iOS:** C++ implementation via simdutf
- **Android:** C++ implementation via simdutf

## Error Handling
Throws descriptive errors for invalid base64 input, remainder issues, or extra bits in padding.

## License
MIT

## Credits
- [simdutf](https://github.com/simdutf/simdutf)
- [Nitro Modules](https://github.com/mrousavy/nitro)
