/* global performance, atob, btoa */
import jsBase64 from 'base64-js';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { decode, encode } from 'react-native-nitro-base64';
import { data as largeData } from './image-large.json';
import { data } from './image.json';
const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const round = (num: number, decimalPlaces = 0): string => {
  return num.toFixed(decimalPlaces);
};

const Benchmarks2 = () => {
  const [processingJSBase64, setProcessingJSBase64] = useState<boolean>(false);
  const [jsBase64Result, setJSBase64Result] = useState<number>(0);
  const [processingNativeBase64, setProcessingNativeBase64] =
    useState<boolean>(false);
  const [nativeBase64Result, setNativeBase64Result] = useState<number>(0);
  const [processingObjcBase64, setProcessingObjcBase64] =
    useState<boolean>(false);
  const [objcBase64Result, setObjcBase64Result] = useState<number>(0);
  const [processingAtobBtoa, setProcessingAtobBtoa] = useState<boolean>(false);
  const [atobBtoaResult, setAtobBtoaResult] = useState<number>(0);
  const [processingAtobBtoaLarge, setProcessingAtobBtoaLarge] =
    useState<boolean>(false);
  const [atobBtoaLargeResult, setAtobBtoaLargeResult] = useState<number>(0);
  const [processingJSBase64Large, setProcessingJSBase64Large] =
    useState<boolean>(false);
  const [jsBase64LargeResult, setJSBase64LargeResult] = useState<number>(0);

  const handleNativeBase64Press = async () => {
    setProcessingNativeBase64(true);
    let dataToProcess = data;
    await sleep(1);
    const startTime = performance.now();

    for (let iter = 0; iter < 30; iter++) {
      const decoded = encode(dataToProcess);
      dataToProcess = decode(decoded);
      if (dataToProcess !== data) {
        throw new Error('Data does not match');
      }
    }
    const finishedTime = performance.now();
    console.log(
      'Nitro C++ done! took',
      finishedTime - startTime,
      'milliseconds'
    );
    setNativeBase64Result(finishedTime - startTime);
    setProcessingNativeBase64(false);
  };

  const handleJSBase64Press = async () => {
    setProcessingJSBase64(true);
    let dataToProcess = data;
    await sleep(1);
    const startTime = performance.now();

    for (let iter = 0; iter < 30; iter++) {
      const decoded = jsBase64.toByteArray(dataToProcess);
      dataToProcess = jsBase64.fromByteArray(decoded);
    }
    const finishedTime = performance.now();
    console.log(
      'base64-js done! took',
      finishedTime - startTime,
      'milliseconds'
    );
    setJSBase64Result(finishedTime - startTime);
    setProcessingJSBase64(false);
  };

  // atob/btoa benchmark (native browser API) - Small image
  const handleAtobBtoaPress = async () => {
    setProcessingAtobBtoa(true);
    let dataToProcess = data;
    await sleep(1);
    const startTime = performance.now();

    try {
      for (let iter = 0; iter < 30; iter++) {
        // btoa expects a binary string, atob returns a binary string
        const decoded = atob(dataToProcess);
        dataToProcess = btoa(decoded);
      }
      const finishedTime = performance.now();
      console.log(
        'atob/btoa done! took',
        finishedTime - startTime,
        'milliseconds'
      );
      setAtobBtoaResult(finishedTime - startTime);
    } catch (error) {
      console.error('atob/btoa error:', error);
      setAtobBtoaResult(-1); // Indicate error
    }
    setProcessingAtobBtoa(false);
  };

  // atob/btoa benchmark (native browser API) - Large image
  const handleAtobBtoaLargePress = async () => {
    setProcessingAtobBtoaLarge(true);
    let dataToProcess = largeData;
    await sleep(1);
    const startTime = performance.now();

    try {
      for (let iter = 0; iter < 30; iter++) {
        const decoded = atob(dataToProcess);
        dataToProcess = btoa(decoded);
      }
      const finishedTime = performance.now();
      console.log(
        'atob/btoa Large done! took',
        finishedTime - startTime,
        'milliseconds'
      );
      setAtobBtoaLargeResult(finishedTime - startTime);
    } catch (error) {
      console.error('atob/btoa Large error:', error);
      setAtobBtoaLargeResult(-1); // Indicate error
    }
    setProcessingAtobBtoaLarge(false);
  };

  // Large image base64-js benchmark
  const handleJSBase64LargePress = async () => {
    setProcessingJSBase64Large(true);
    let dataToProcess = largeData;
    await sleep(1);
    const startTime = performance.now();

    for (let iter = 0; iter < 30; iter++) {
      const decoded = jsBase64.toByteArray(dataToProcess);
      dataToProcess = jsBase64.fromByteArray(decoded);
    }
    const finishedTime = performance.now();
    console.log(
      'base64-js Large done! took',
      finishedTime - startTime,
      'milliseconds'
    );
    setJSBase64LargeResult(finishedTime - startTime);
    setProcessingJSBase64Large(false);
  };

  // Large Nitro C++ base64 benchmark
  const handleObjcBase64Press = async () => {
    setProcessingObjcBase64(true);
    let dataToProcess = largeData;
    await sleep(1);
    const startTime = performance.now();
    for (let iter = 0; iter < 30; iter++) {
      const decoded = encode(dataToProcess);
      dataToProcess = decode(decoded);
    }
    const finishedTime = performance.now();
    console.log(
      'Nitro C++ Large done! took',
      finishedTime - startTime,
      'milliseconds'
    );
    setObjcBase64Result(finishedTime - startTime);
    setProcessingObjcBase64(false);
  };

  const calculateSpeedup = (baseTime: number, compareTime: number) => {
    if (!baseTime || !compareTime || compareTime <= 0) return '';
    return `(${round(baseTime / compareTime, 2)}x faster)`;
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Small Image (7KB) - 30 iterations</Text>

      <View style={styles.lib}>
        <Text style={styles.heading}>Nitro Simdutf C++</Text>
        <Text style={styles.result}>
          {nativeBase64Result > 0 ? `${round(nativeBase64Result, 2)}ms` : ''}
        </Text>
      </View>

      <View style={styles.lib}>
        <Text style={styles.heading}>base64-js (JS)</Text>
        <Text style={styles.result}>
          {jsBase64Result > 0
            ? `${round(jsBase64Result, 2)}ms ${calculateSpeedup(jsBase64Result, nativeBase64Result)}`
            : ''}
        </Text>
      </View>

      <View style={styles.lib}>
        <Text style={styles.heading}>atob/btoa (Native)</Text>
        <Text style={styles.result}>
          {atobBtoaResult > 0
            ? `${round(atobBtoaResult, 2)}ms ${calculateSpeedup(atobBtoaResult, nativeBase64Result)}`
            : atobBtoaResult === -1
              ? 'Error/Not supported'
              : ''}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Large Image (1.3MB) - 30 iterations
      </Text>

      <View style={styles.lib}>
        <Text style={styles.heading}>Nitro Simdutf C++</Text>
        <Text style={styles.result}>
          {objcBase64Result > 0 ? `${round(objcBase64Result, 2)}ms` : ''}
        </Text>
      </View>

      <View style={styles.lib}>
        <Text style={styles.heading}>base64-js (JS)</Text>
        <Text style={styles.result}>
          {jsBase64LargeResult > 0
            ? `${round(jsBase64LargeResult, 2)}ms ${calculateSpeedup(jsBase64LargeResult, objcBase64Result)}`
            : ''}
        </Text>
      </View>

      <View style={styles.lib}>
        <Text style={styles.heading}>atob/btoa (Native)</Text>
        <Text style={styles.result}>
          {atobBtoaLargeResult > 0
            ? `${round(atobBtoaLargeResult, 2)}ms ${calculateSpeedup(atobBtoaLargeResult, objcBase64Result)}`
            : atobBtoaLargeResult === -1
              ? 'Error/Not supported'
              : ''}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          handleNativeBase64Press();
          handleJSBase64Press();
          handleAtobBtoaPress();
          handleObjcBase64Press();
          handleJSBase64LargePress();
          handleAtobBtoaLargePress();
        }}
        style={styles.button}
      >
        <Text style={styles.pressable}>
          {processingNativeBase64 ||
          processingJSBase64 ||
          processingObjcBase64 ||
          processingAtobBtoa ||
          processingAtobBtoaLarge ||
          processingJSBase64Large
            ? 'Processing...'
            : 'Run Benchmarks'}
        </Text>
      </Pressable>
    </View>
  );
};

export default Benchmarks2;

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
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
  speedup: {
    marginVertical: 5,
    fontSize: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
