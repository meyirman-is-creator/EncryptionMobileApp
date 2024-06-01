import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
const sha224 = require('./algorithms/sha224');
const { encrypt, decrypt, generateKeys } = require('./algorithms/rsa');
const { ECC, Point } = require('./algorithms/ecc');

const App = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [rsaPrivateKey, setRsaPrivateKey] = useState('');
  const [rsaModulus, setRsaModulus] = useState('');
  const [rsaInputFormat, setRsaInputFormat] = useState('Hex');
  const [rsaOutputFormat, setRsaOutputFormat] = useState('Hex');

  const [eccPrivateKey, setEccPrivateKey] = useState('');
  const [eccPublicKeyX, setEccPublicKeyX] = useState('');
  const [eccPublicKeyY, setEccPublicKeyY] = useState('');
  const [inputError, setInputError] = useState('');

  const handleEncrypt = (algorithm) => {
    if (inputText === "") {
      setInputError('Input text cannot be empty');
      return;
    }
    setInputError('');
    let encrypted;
    switch (algorithm) {
      case 'SHA224':
        encrypted = sha224(inputText);
        break;
      case 'ECC':
        const ecc = new ECC(1, 1, 23, new Point(9, 17), 19);
        const publicKey = new Point(parseInt(eccPublicKeyX, 10), parseInt(eccPublicKeyY, 10));
        const messagePoint = ecc.encodeMessage(inputText);
        encrypted = ecc.encrypt(messagePoint, publicKey);
        break;
      case 'RSA':
        const keys = generateKeys(61, 53);
        setRsaPublicKey(keys.publicKey.e);
        setRsaPrivateKey(keys.privateKey.d);
        setRsaModulus(keys.publicKey.n);
        encrypted = encrypt(inputText, keys.publicKey);
        break;
      default:
        encrypted = '';
    }
    if ('ECC' === algorithm) {
      setOutputText(`C1(${encrypted.C1.x}, ${encrypted.C1.y});C2(${encrypted.C2.x}, ${encrypted.C2.y})`);
    } else {
      setOutputText(encrypted);
    }
  };

  const handleDecrypt = (algorithm) => {
    if (!inputText) {
      setInputError('Input text cannot be empty');
      return;
    }
    setInputError('');
    let decrypted;
    switch (algorithm) {
      case 'RSA':
        const keys = {
          publicKey: { e: rsaPublicKey, n: rsaModulus },
          privateKey: { d: rsaPrivateKey, n: rsaModulus }
        };
        decrypted = decrypt(inputText.split(',').map(Number), keys.privateKey);
        break;
      case 'ECC':
        const ecc = new ECC(1, 1, 23, new Point(9, 17), 19);
        const privateKey = parseInt(eccPrivateKey, 10);
        const encryptedPoints = inputText.split(';').map(pt => {
          const coords = pt.slice(3, -1).split(',').map(Number);
          return new Point(coords[0], coords[1]);
        });
        decrypted = ecc.decrypt({ C1: encryptedPoints[0], C2: encryptedPoints[1] }, privateKey);
        decrypted = ecc.decodeMessage(decrypted);
        break;
      default:
        decrypted = '';
    }
    setOutputText(decrypted);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Input</Text>
      <TextInput
        style={[styles.input, inputError ? styles.inputError : null]}
        placeholder="Input the text"
        value={inputText}
        onChangeText={setInputText}
        multiline
      />
      {inputError ? <Text style={styles.errorText}>{inputError}</Text> : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedAlgorithm(''); handleEncrypt('SHA224'); }}>
          <Text>SHA224</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedAlgorithm('RSA'); }}>
          <Text>RSA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedAlgorithm('ECC'); }}>
          <Text>ECC</Text>
        </TouchableOpacity>
      </View>

      {selectedAlgorithm === 'RSA' && (
        <View style={styles.rsaContainer}>
          <Text style={styles.subHeader}>RSA Options</Text>
          <TextInput
            style={styles.input}
            placeholder="Public Key Exponent (e)"
            value={rsaPublicKey}
            onChangeText={setRsaPublicKey}
          />
          <TextInput
            style={styles.input}
            placeholder="Private Key Exponent (d)"
            value={rsaPrivateKey}
            onChangeText={setRsaPrivateKey}
          />
          <TextInput
            style={styles.input}
            placeholder="Modulus (n)"
            value={rsaModulus}
            onChangeText={setRsaModulus}
          />
          <View style={styles.row}>
            <Text style={styles.label}>Output Format:</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity onPress={() => setRsaOutputFormat('Base64')}>
                <Text style={rsaOutputFormat === 'Base64' ? styles.radioSelected : styles.radio}>Base64</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRsaOutputFormat('Hex')}>
                <Text style={rsaOutputFormat === 'Hex' ? styles.radioSelected : styles.radio}>Hex</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Input Format:</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity onPress={() => setRsaInputFormat('Base64')}>
                <Text style={rsaInputFormat === 'Base64' ? styles.radioSelected : styles.radio}>Base64</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRsaInputFormat('Hex')}>
                <Text style={rsaInputFormat === 'Hex' ? styles.radioSelected : styles.radio}>Hex</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleEncrypt('RSA')}>
            <Text style={{ color: '#fff' }}>Encryption</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleDecrypt('RSA')}>
            <Text style={{ color: '#fff' }}>Decryption</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedAlgorithm === 'ECC' && (
        <View style={styles.eccContainer}>
          <Text style={styles.subHeader}>ECC Options</Text>
          <TextInput
            style={styles.input}
            placeholder="Private Key"
            value={eccPrivateKey}
            onChangeText={setEccPrivateKey}
          />
          <TextInput
            style={styles.input}
            placeholder="Public Key X"
            value={eccPublicKeyX}
            onChangeText={setEccPublicKeyX}
          />
          <TextInput
            style={styles.input}
            placeholder="Public Key Y"
            value={eccPublicKeyY}
            onChangeText={setEccPublicKeyY}
          />
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleEncrypt('ECC')}>
            <Text style={{ color: '#fff' }}>Encryption</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleDecrypt('ECC')}>
            <Text style={{ color: '#fff' }}>Decryption</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.header}>Output</Text>
      <TextInput style={styles.input} value={outputText} editable={false} multiline />
      <Button title="Copy" onPress={() => { handleEncrypt() }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  inputError: {
    borderColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  rsaContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  eccContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  label: {
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  radio: {
    marginRight: 10,
  },
  radioSelected: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  encryptButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default App;
