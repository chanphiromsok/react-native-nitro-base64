import {
  fromByteArray as quickFromByteArray,
  toByteArray as quickToByteArray,
} from 'react-native-quick-base64';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  decode,
  decodeBuffer,
  encode,
  encodeBuffer,
  fromByteArray,
  toByteArray,
} from 'react-native-nitro-base64';
import { data as largeData } from './image-large.json';
import { data } from './image.json';

declare const performance: { now(): number };
declare function atob(data: string): string;
declare function btoa(data: string): string;

const sleep = (t: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, t));
const round = (num: number, decimalPlaces = 0): string =>
  num.toFixed(decimalPlaces);
const speedup = (ms: number, base: number) => {
  if (!ms || !base || base <= 0) return '';
  const ratio = base / ms;
  if (ratio >= 1) return `(${round(ratio, 2)}x faster)`;
  return `(${round(1 / ratio, 2)}x slower)`;
};

const Benchmarks2 = () => {
  // Nitro string (small / large)
  const [nitroResult, setNitroResult] = useState(0);
  const [nitroLargeResult, setNitroLargeResult] = useState(0);

  // quick-base64 (small / large)
  const [quickResult, setQuickResult] = useState(0);
  const [quickLargeResult, setQuickLargeResult] = useState(0);

  // atob/btoa (small / large)
  const [atobResult, setAtobResult] = useState(0);
  const [atobLargeResult, setAtobLargeResult] = useState(0);

  // decodeBuffer (small / large)
  const [decodeBufferResult, setDecodeBufferResult] = useState(0);
  const [decodeBufferLargeResult, setDecodeBufferLargeResult] = useState(0);

  // encodeBuffer (small / large)
  const [encodeBufferResult, setEncodeBufferResult] = useState(0);
  const [encodeBufferLargeResult, setEncodeBufferLargeResult] = useState(0);

  // fromByteArray / toByteArray (small / large)
  const [fromByteArrayResult, setFromByteArrayResult] = useState(0);
  const [fromByteArrayLargeResult, setFromByteArrayLargeResult] = useState(0);
  const [toByteArrayResult, setToByteArrayResult] = useState(0);
  const [toByteArrayLargeResult, setToByteArrayLargeResult] = useState(0);

  const [processing, setProcessing] = useState(false);

  // ── Nitro string ──────────────────────────────────────────────────────────

  const runNitro = async (src: string): Promise<number> => {
    let d = src;
    await sleep(1);
    const t = performance.now();
    for (let i = 0; i < 30; i++) {
      const enc = encode(d);
      d = decode(enc);
    }
    return performance.now() - t;
  };

  // ── quick-base64 ──────────────────────────────────────────────────────────

  const runQuick = async (src: string): Promise<number> => {
    let d = src;
    await sleep(1);
    const t = performance.now();
    for (let i = 0; i < 30; i++) {
      const bytes = quickToByteArray(d);
      d = quickFromByteArray(bytes);
    }
    return performance.now() - t;
  };

  // ── atob/btoa ─────────────────────────────────────────────────────────────

  const runAtob = async (src: string): Promise<number> => {
    let d = src;
    await sleep(1);
    const t = performance.now();
    try {
      for (let i = 0; i < 30; i++) {
        const bin = atob(d);
        d = btoa(bin);
      }
    } catch {
      return -1;
    }
    return performance.now() - t;
  };

  // ── decodeBuffer ──────────────────────────────────────────────────────────

  const runDecodeBuffer = async (src: string): Promise<number> => {
    const encoded = encode(src);
    await sleep(1);
    const t = performance.now();
    for (let i = 0; i < 30; i++) decodeBuffer(encoded);
    return performance.now() - t;
  };

  // ── encodeBuffer ──────────────────────────────────────────────────────────

  const runEncodeBuffer = async (src: string): Promise<number> => {
    const binary = decodeBuffer(src);
    await sleep(1);
    const t = performance.now();
    for (let i = 0; i < 30; i++) encodeBuffer(binary);
    return performance.now() - t;
  };

  // ── fromByteArray ─────────────────────────────────────────────────────────

  const runFromByteArray = async (src: string): Promise<number> => {
    const bytes = new Uint8Array(decodeBuffer(src));
    await sleep(1);
    const t = performance.now();
    for (let i = 0; i < 30; i++) fromByteArray(bytes);
    return performance.now() - t;
  };

  // ── toByteArray ───────────────────────────────────────────────────────────

  const runToByteArray = async (src: string): Promise<number> => {
    const encoded = encode(src);
    await sleep(1);
    const t = performance.now();
    for (let i = 0; i < 30; i++) toByteArray(encoded);
    return performance.now() - t;
  };

  // ── Run all ───────────────────────────────────────────────────────────────

  const handleRunAll = async () => {
    setProcessing(true);

    const [n, nL, q, qL, a, aL, db, dbL, eb, ebL, fba, fbaL, tba, tbaL] =
      await Promise.all([
        runNitro(data),
        runNitro(largeData),
        runQuick(data),
        runQuick(largeData),
        runAtob(data),
        runAtob(largeData),
        runDecodeBuffer(data),
        runDecodeBuffer(largeData),
        runEncodeBuffer(data),
        runEncodeBuffer(largeData),
        runFromByteArray(data),
        runFromByteArray(largeData),
        runToByteArray(data),
        runToByteArray(largeData),
      ]);

    setNitroResult(n);
    setNitroLargeResult(nL);
    setQuickResult(q);
    setQuickLargeResult(qL);
    setAtobResult(a);
    setAtobLargeResult(aL);
    setDecodeBufferResult(db);
    setDecodeBufferLargeResult(dbL);
    setEncodeBufferResult(eb);
    setEncodeBufferLargeResult(ebL);
    setFromByteArrayResult(fba);
    setFromByteArrayLargeResult(fbaL);
    setToByteArrayResult(tba);
    setToByteArrayLargeResult(tbaL);

    setProcessing(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const Row = ({
    label,
    ms,
    base,
  }: {
    label: string;
    ms: number;
    base: number;
  }) => (
    <View style={styles.lib}>
      <Text style={styles.heading}>{label}</Text>
      <Text style={styles.result}>
        {ms > 0
          ? `${round(ms, 2)}ms ${speedup(ms, base)}`
          : ms === -1
            ? 'Not supported'
            : ''}
      </Text>
    </View>
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>Small Image (7KB) — 30 iterations</Text>

      <View style={styles.lib}>
        <Text style={styles.heading}>Nitro simdutf C++ (string)</Text>
        <Text style={styles.result}>
          {nitroResult > 0 ? `${round(nitroResult, 2)}ms` : ''}
        </Text>
      </View>
      <Row
        label="quick-base64 (Uint8Array)"
        ms={quickResult}
        base={nitroResult}
      />
      <Row label="atob/btoa (Hermes)" ms={atobResult} base={nitroResult} />
      <Row
        label="decodeBuffer (ArrayBuffer)"
        ms={decodeBufferResult}
        base={nitroResult}
      />
      <Row
        label="encodeBuffer (ArrayBuffer)"
        ms={encodeBufferResult}
        base={nitroResult}
      />
      <Row
        label="fromByteArray (Uint8Array)"
        ms={fromByteArrayResult}
        base={nitroResult}
      />
      <Row
        label="toByteArray (Uint8Array)"
        ms={toByteArrayResult}
        base={nitroResult}
      />

      <Text style={styles.sectionTitle}>
        Large Image (1.3MB) — 30 iterations
      </Text>

      <View style={styles.lib}>
        <Text style={styles.heading}>Nitro simdutf C++ (string)</Text>
        <Text style={styles.result}>
          {nitroLargeResult > 0 ? `${round(nitroLargeResult, 2)}ms` : ''}
        </Text>
      </View>
      <Row
        label="quick-base64 (Uint8Array)"
        ms={quickLargeResult}
        base={nitroLargeResult}
      />
      <Row
        label="atob/btoa (Hermes)"
        ms={atobLargeResult}
        base={nitroLargeResult}
      />
      <Row
        label="decodeBuffer (ArrayBuffer)"
        ms={decodeBufferLargeResult}
        base={nitroLargeResult}
      />
      <Row
        label="encodeBuffer (ArrayBuffer)"
        ms={encodeBufferLargeResult}
        base={nitroLargeResult}
      />
      <Row
        label="fromByteArray (Uint8Array)"
        ms={fromByteArrayLargeResult}
        base={nitroLargeResult}
      />
      <Row
        label="toByteArray (Uint8Array)"
        ms={toByteArrayLargeResult}
        base={nitroLargeResult}
      />

      <Pressable onPress={handleRunAll} style={styles.button}>
        <Text style={styles.pressable}>
          {processing ? 'Processing...' : 'Run Benchmarks'}
        </Text>
      </Pressable>
    </View>
  );
};

export default Benchmarks2;

const styles = StyleSheet.create({
  lib: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 14,
    marginVertical: 5,
  },
  pressable: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginVertical: 5,
    fontSize: 12,
  },
  button: {
    backgroundColor: 'skyblue',
    padding: 16,
    marginTop: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
