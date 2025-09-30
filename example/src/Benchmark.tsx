import { encode, decode } from 'react-native-nitro-base64';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const NitroBase64Demo = () => {
  const [inputText, setInputText] = useState('Hello OneGo! 🚗⚡');
  const [results, setResults] = useState('');
  const [urlSafeMode, setUrlSafeMode] = useState(false);

  const logResult = (label: string, value: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newResult = `[${timestamp}] ${label}: ${value}\n`;
    setResults((prev) => prev + newResult);
    console.log(`${label}:`, value);
  };

  const testNitroEncode = () => {
    try {
      const result = encode(inputText, urlSafeMode);
      logResult(`Nitro Encode (urlSafe: ${urlSafeMode})`, result);
      Alert.alert('Encode Success', `Result: ${result.substring(0, 50)}...`);
    } catch (error) {
      logResult('Nitro Encode Error', `${error}`);
      Alert.alert('Encode Error', `${error}`);
    }
  };

  const testNitroDecode = () => {
    try {
      // First encode to get valid base64
      const encoded = encode(inputText, urlSafeMode);
      const result = decode(encoded, urlSafeMode);
      logResult(`Nitro Decode (urlSafe: ${urlSafeMode})`, result);
      logResult('Round Trip Success', `${result === inputText ? 'YES' : 'NO'}`);
      Alert.alert(
        'Decode Success',
        `Original: ${inputText}\nDecoded: ${result}\nMatch: ${result === inputText ? 'YES' : 'NO'}`
      );
    } catch (error) {
      logResult('Nitro Decode Error', `${error}`);
      Alert.alert('Decode Error', `${error}`);
    }
  };

  const testComparison = () => {
    try {
      // Test with different methods like your example
      const nitroEncoded = encode(inputText, false);
      logResult('Nitro encode()', nitroEncoded);

      const nitroDecoded = decode(nitroEncoded, false);
      logResult('Nitro decode()', nitroDecoded);

      // Test URL-safe version
      const nitroUrlSafe = encode(inputText, true);
      logResult('Nitro URL-safe encode()', nitroUrlSafe);

      const nitroUrlSafeDecoded = decode(nitroUrlSafe, true);
      logResult('Nitro URL-safe decode()', nitroUrlSafeDecoded);

      // Test if they match
      logResult(
        'Standard vs URL-safe match',
        `${nitroEncoded === nitroUrlSafe ? 'YES' : 'NO'}`
      );
      logResult(
        'Both decode correctly',
        `${nitroDecoded === inputText && nitroUrlSafeDecoded === inputText ? 'YES' : 'NO'}`
      );

      Alert.alert(
        'Comparison Complete',
        'Check console and results section for details'
      );
    } catch (error) {
      logResult('Comparison Error', `${error}`);
      Alert.alert('Comparison Error', `${error}`);
    }
  };

  const testSpecialCases = () => {
    const testCases = [
      { name: 'Empty string', data: '' },
      { name: 'Single char', data: 'A' },
      { name: 'Special chars', data: '!@#$%^&*()' },
      { name: 'Unicode/Emoji', data: '🚗⚡🔋' },
      { name: 'Khmer text', data: 'ការសាកថ្ម' },
      { name: 'API creds format', data: 'user:pass@123' },
    ];

    let passCount = 0;
    testCases.forEach((testCase) => {
      try {
        const encoded = encode(testCase.data, urlSafeMode);
        const decoded = decode(encoded, urlSafeMode);
        const success = decoded === testCase.data;
        if (success) passCount++;
        logResult(
          `${testCase.name}`,
          `✓ ${success ? 'PASS' : 'FAIL'} | "${testCase.data}" -> "${encoded.substring(0, 20)}..." -> "${decoded}"`
        );
      } catch (error) {
        logResult(`${testCase.name}`, `✗ ERROR: ${error}`);
      }
    });

    Alert.alert(
      'Edge Cases Complete',
      `${passCount}/${testCases.length} tests passed`
    );
  };

  const testPerformance = () => {
    const sizes = [100, 1000, 10000];

    sizes.forEach((size) => {
      const largeText = 'A'.repeat(size);
      const startTime = Date.now();

      try {
        const encoded = encode(largeText, urlSafeMode);
        const decoded = decode(encoded, urlSafeMode);
        const endTime = Date.now();
        const duration = endTime - startTime;

        logResult(
          `Performance ${size} chars`,
          `${duration}ms | Success: ${decoded.length === size ? 'YES' : 'NO'}`
        );
      } catch (error) {
        logResult(`Performance ${size} chars`, `ERROR: ${error}`);
      }
    });

    Alert.alert(
      'Performance Tests Complete',
      'Check results for timing details'
    );
  };

  const clearResults = () => {
    setResults('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Nitro Base64 Testing 🧪</Text>

        {/* URL Safe Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>URL Safe Mode:</Text>
          <TouchableOpacity
            onPress={() => setUrlSafeMode(!urlSafeMode)}
            style={[
              styles.toggleButton,
              urlSafeMode ? styles.toggleActive : styles.toggleInactive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                urlSafeMode
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              {urlSafeMode ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Input:</Text>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter text to test..."
            multiline
            numberOfLines={3}
            style={styles.textInput}
          />
        </View>

        {/* Test Buttons */}
        <View style={styles.section}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={testNitroEncode}
              style={[
                styles.button,
                styles.buttonPrimary,
                { flex: 1, marginRight: 8 },
              ]}
            >
              <Text style={styles.buttonTextPrimary}>encode()</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testNitroDecode}
              style={[
                styles.button,
                styles.buttonPrimary,
                { flex: 1, marginLeft: 8 },
              ]}
            >
              <Text style={styles.buttonTextPrimary}>decode()</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={testComparison}
            style={[
              styles.button,
              styles.buttonPrimary,
              styles.fullWidthButton,
            ]}
          >
            <Text style={styles.buttonTextPrimary}>
              🔄 Full Comparison Test
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={testSpecialCases}
              style={[
                styles.button,
                styles.buttonSecondary,
                { flex: 1, marginRight: 8 },
              ]}
            >
              <Text style={styles.buttonTextSecondary}>🎯 Edge Cases</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testPerformance}
              style={[
                styles.button,
                styles.buttonSecondary,
                { flex: 1, marginLeft: 8 },
              ]}
            >
              <Text style={styles.buttonTextSecondary}>⚡ Performance</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={clearResults}
            style={[
              styles.button,
              styles.buttonSecondary,
              styles.fullWidthButton,
            ]}
          >
            <Text style={styles.buttonTextSecondary}>🗑️ Clear Results</Text>
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>Test Results:</Text>
            <Text style={styles.subtitle}>(Also check console logs)</Text>
          </View>

          <ScrollView
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.resultsText}>
              {results || 'No results yet. Run some tests!'}
            </Text>
          </ScrollView>
        </View>

        {/* Quick Test Examples */}
        <View style={[styles.section, styles.quickTestsContainer]}>
          <Text style={styles.sectionTitle}>Quick Tests:</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => {
                setInputText('Hello World');
                setTimeout(testComparison, 100);
              }}
              style={[
                styles.button,
                styles.buttonSecondary,
                { flex: 1, marginRight: 4 },
              ]}
            >
              <Text style={[styles.buttonTextSecondary, styles.smallText]}>
                Simple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setInputText('🚗⚡🔋');
                setTimeout(testComparison, 100);
              }}
              style={[
                styles.button,
                styles.buttonSecondary,
                { flex: 1, marginHorizontal: 4 },
              ]}
            >
              <Text style={[styles.buttonTextSecondary, styles.smallText]}>
                Emoji
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setInputText('user:pass+/=');
                setTimeout(testComparison, 100);
              }}
              style={[
                styles.button,
                styles.buttonSecondary,
                { flex: 1, marginLeft: 4 },
              ]}
            >
              <Text style={[styles.buttonTextSecondary, styles.smallText]}>
                Special
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginRight: 12,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleInactive: {
    backgroundColor: '#e0e0e0',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  toggleTextInactive: {
    color: '#666',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    color: '#000',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlignVertical: 'top',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  fullWidthButton: {
    marginBottom: 12,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsContainer: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    maxHeight: 300,
  },
  resultsText: {
    color: '#00FF00',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  quickTestsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  smallText: {
    fontSize: 12,
  },
});

export default NitroBase64Demo;
