/* global performance */
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
    console.log('done! took', finishedTime - startTime, 'milliseconds');
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
    console.log('done! took', finishedTime - startTime, 'milliseconds');
    setJSBase64Result(finishedTime - startTime);
    setProcessingJSBase64(false);
  };
  // Large Objective-C NSData base64 benchmark (iOS only)
  const handleObjcBase64Press = async () => {
    setProcessingObjcBase64(true);
    let dataToProcess = largeData;
    await sleep(1);
    const startTime = performance.now();
    for (let iter = 0; iter < 30; iter++) {
      // NativeModules.NitroBase64Objc.encode/decode should be implemented in ObjC for demo
      const decoded = encode(dataToProcess);
      dataToProcess = decode(decoded);
    }
    const finishedTime = performance.now();
    console.log('ObjC done! took', finishedTime - startTime, 'milliseconds');
    setObjcBase64Result(finishedTime - startTime);
    setProcessingObjcBase64(false);
  };

  // const speedup =
  //   jsBase64Result && nativeBase64Result
  //     ? round(jsBase64Result / nativeBase64Result) + 'x faster'
  //     : ' ';

  return (
    <View>
      <View style={styles.lib}>
        <Text style={styles.heading}>Nitro Simduft C++ 7KB </Text>
        <Text style={styles.result}>
          {nativeBase64Result > 0
            ? `${round(nativeBase64Result, 6)} milliseconds`
            : ''}
        </Text>
      </View>
      <View style={styles.lib}>
        <Text style={styles.heading}>Nitro Simduft C++ 1.3MB</Text>
        <Text style={styles.result}>
          {objcBase64Result > 0
            ? `${round(objcBase64Result, 6)} milliseconds`
            : ''}
        </Text>
      </View>

      <View style={styles.lib}>
        <Text style={styles.heading}>base64-js 7KB</Text>
        <Text style={styles.result}>
          {jsBase64Result > 0 ? `${round(jsBase64Result, 6)} milliseconds` : ''}
        </Text>
      </View>

      {/* <Text style={styles.speedup}>{speedup}</Text> */}

      <Pressable
        onPress={() => {
          handleNativeBase64Press();
          handleJSBase64Press();
          handleObjcBase64Press();
        }}
        style={styles.button}
      >
        <Text style={styles.pressable}>
          {processingNativeBase64 || processingJSBase64 || processingObjcBase64
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
  },
  heading: {
    fontSize: 14,
    marginVertical: 5,
  },
  pressable: {
    textAlign: 'center',
  },
  result: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginVertical: 5,
  },
  button: { backgroundColor: 'skyblue', padding: 12 },
  speedup: {
    marginVertical: 5,
    fontSize: 18,
    textAlign: 'center',
  },
});
