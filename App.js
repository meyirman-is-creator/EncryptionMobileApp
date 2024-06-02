import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
const sha224 = require('./algorithms/sha224');
const { encrypt, decrypt, generateKeys } = require('./algorithms/rsa');
const caesarCipher = require('./algorithms/ceaser');
const App = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [rsaPrivateKey, setRsaPrivateKey] = useState('');
  const [rsaModulus, setRsaModulus] = useState('');
  const [rsaInputFormat, setRsaInputFormat] = useState('Hex');
  const [rsaOutputFormat, setRsaOutputFormat] = useState('Hex');
  const [shift, setShift] = useState(3);

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
        case 'Caesar':
        encrypted = caesarCipher.encrypt(inputText, shift);
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
      setOutputText(encrypted);
    
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
        const encryptedNumbers = inputText.split(',').map(str => parseInt(str, 10));
        decrypted = decrypt(encryptedNumbers, keys.privateKey);
        break;
        case 'Caesar':
        decrypted = caesarCipher.decrypt(inputText, shift);
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
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedAlgorithm('Caesar'); }}>
          <Text>Caesar Cipher</Text>
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
      {selectedAlgorithm === 'Caesar' && (
        <View style={styles.caesarContainer}>
          <Text style={styles.subHeader}>Caesar Cipher Options</Text>
          <TextInput
            style={styles.input}
            placeholder="Shift"
            value={shift.toString()}
            onChangeText={text => setShift(parseInt(text, 10))}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleEncrypt('Caesar')}>
            <Text style={{ color: '#fff' }}>Encryption</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleDecrypt('Caesar')}>
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
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  rsaContainer: {
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radio: {
    marginRight: 10,
  },
  radioSelected: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  encryptButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  caesarContainer: {
    marginBottom: 16,
  },
});

export default App;
