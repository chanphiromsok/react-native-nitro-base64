import { StyleSheet, View } from 'react-native';
// @ts-ignore
import NitroBase64Demo from './Benchmark';
export default function App() {
  return (
    <View style={styles.container}>
      {/* <Benchmarks /> */}
      <NitroBase64Demo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
