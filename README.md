# NitroBase64

A high-performance, cross-platform Base64 encoding/decoding module for React Native, powered by C++ and simdutf. Implements WHATWG forgiving-base64 and supports both standard and URL-safe variants.

| iPhone                                            | Android                                             |
| ------------------------------------------------- | --------------------------------------------------- |
| ![iPhone](./docs/ios.png) | ![Android](./docs/android.png) |
## Features
- Fast C++ implementation using [simdutf](https://github.com/simdutf/simdutf)
- WHATWG forgiving-base64 compliance (removes whitespace, optional padding)
- Supports both standard and URL-safe base64
- Consistent API for iOS and Android
- Detailed error handling

## Installation

```sh
yarn add react-native-nitro-base64
yarn add react-native-nitro-modules
```

### Linking
This module uses [react-native-nitro-modules](https://github.com/mrousavy/nitro). Follow Nitro's setup instructions for autolinking and native builds.

## API

| Function | Input | Output | Use case |
|---|---|---|---|
| `encode(str, urlSafe?)` | binary string | base64 string | Text/JWT encoding |
| `decode(base64)` | base64 string | binary string | Text/JWT decoding — accepts standard and URL-safe automatically |
| `encodeBuffer(ArrayBuffer, urlSafe?)` | ArrayBuffer | base64 string | Image/file → base64 |
| `decodeBuffer(base64)` | base64 string | ArrayBuffer | base64 → raw binary — accepts standard and URL-safe automatically |
| `fromByteArray(Uint8Array, urlSafe?)` | Uint8Array | base64 string | Crypto/hashing output → base64 |
| `toByteArray(base64)` | base64 string | Uint8Array | base64 → typed binary — accepts standard and URL-safe automatically |

### Which one should I use?

**Working with images?** Use `encodeBuffer` / `decodeBuffer`.

Images are binary data. Passing them through a JS string crosses the JSI bridge as UTF-16, doubling memory and adding overhead. `ArrayBuffer` avoids that — raw bytes go directly to C++.

```typescript
import { encodeBuffer, decodeBuffer } from 'react-native-nitro-base64';
import { readFile } from 'react-native-fs';

// Image file → base64 (for API upload)
const bytes = await readFile(imagePath, 'ascii'); // or use arrayBuffer APIs
const base64 = encodeBuffer(buffer); // ArrayBuffer → base64

// base64 from API → display in <Image>
const buffer = decodeBuffer(base64String); // base64 → ArrayBuffer
```

**Working with text / JWT?** Use `encode` / `decode`.

```typescript
import { encode, decode } from 'react-native-nitro-base64';

const encoded = encode('Hello World!'); // "SGVsbG8gV29ybGQh"
const decoded = decode(encoded);       // "Hello World!"

// URL-safe (JWT, URL params)
const token = encode(payload, true);
```

**Working with Web Crypto / hashing?** Use `fromByteArray` / `toByteArray`.

Web Crypto APIs (`crypto.subtle`) return `Uint8Array`. These are drop-in compatible with `react-native-quick-base64`.

```typescript
import { fromByteArray, toByteArray } from 'react-native-nitro-base64';

// Hash → base64
const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
const encoded = fromByteArray(hash);

// base64 → bytes for TextDecoder
const bytes = toByteArray(base64String);
const text = new TextDecoder().decode(bytes);
```

## Setup

```javascript
// index.js
import { install } from 'react-native-nitro-base64';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

install(); // call before app mounts
AppRegistry.registerComponent(appName, () => App);
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
