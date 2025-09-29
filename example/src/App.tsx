import { StyleSheet, View } from 'react-native';
import Benchmarks from './Benchmark';
import Benchmarks2 from './Benchmark2';
export default function App() {
  return (
    <View style={styles.container}>
      <Benchmarks />
      <Benchmarks2 />
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
