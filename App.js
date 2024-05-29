import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Button, Picker, StyleSheet } from 'react-native';
const sha1 = require('./algorithms/sha1');
const sha224 = require('./algorithms/sha224');
const { encryptAES, decryptAES } = require('./algorithms/aes');
const { encrypt, decrypt, generateKeys } = require('./algorithms/rsa');
const { ECC, Point } = require('./algorithms/ecc');
const App = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [aesKeySize, setAesKeySize] = useState('128');
  const [aesKey, setAesKey] = useState('');
  const [aesIv, setAesIv] = useState('');
  const [aesMode, setAesMode] = useState('CBC');
  const [aesPadding, setAesPadding] = useState('Pkcs7');
  const [outputFormat, setOutputFormat] = useState('Base64');

  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [rsaPrivateKey, setRsaPrivateKey] = useState('');
  const [rsaModulus, setRsaModulus] = useState('');
  const [rsaInputFormat, setRsaInputFormat] = useState('Hex');
  const [rsaOutputFormat, setRsaOutputFormat] = useState('Hex');

  const [eccA, setEccA] = useState('');
  const [eccB, setEccB] = useState('');
  const [eccP, setEccP] = useState('');
  const [eccGx, setEccGx] = useState('');
  const [eccGy, setEccGy] = useState('');
  const [eccN, setEccN] = useState('');
  const [eccPrivateKey, setEccPrivateKey] = useState('');
  const [eccPublicKeyX, setEccPublicKeyX] = useState('');
  const [eccPublicKeyY, setEccPublicKeyY] = useState('');
  const handleEncrypt = (algorithm) => {
    let encrypted;
    switch (algorithm) {
      case 'SHA1':
        encrypted = sha1(inputText);
        break;
      case 'SHA224':
        encrypted = sha224(inputText);
        break;
      case 'AES':
        encrypted = encryptAES(
          inputText,
          aesKey,
          aesIv,
          aesKeySize,
          aesMode,
          aesPadding,
          outputFormat
        );
        break;
      case 'ECC':
        const ecc = new ECC(
          parseInt(eccA, 10),
          parseInt(eccB, 10),
          parseInt(eccP, 10),
          new Point(parseInt(eccGx, 10), parseInt(eccGy, 10)),
          parseInt(eccN, 10)
        );
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
      setOutputText(`C1(${encrypted.C1.x}, ${encrypted.C1.y}), C2(${encrypted.C2.x}, ${encrypted.C2.y})`);
    } else {
      setOutputText(encrypted);

    }
  };

  const handleDecrypt = (algorithm) => {
    console.log(decryptAES(inputText, aesKey, aesIv, aesKeySize, aesMode, aesPadding, outputFormat))
    let decrypted;
    switch (algorithm) {
      case 'AES':
        decrypted = decryptAES(inputText, aesKey, aesIv, aesKeySize, aesMode, aesPadding, outputFormat);
        break;
      case 'RSA':
        const keys = {
          publicKey: { e: rsaPublicKey, n: rsaModulus },
          privateKey: { d: rsaPrivateKey, n: rsaModulus }
        };
        decrypted = decrypt(inputText.split(',').map(Number), keys.privateKey);
        break;
      case 'ECC':
        const ecc = new ECC(
          parseInt(eccA, 10),
          parseInt(eccB, 10),
          parseInt(eccP, 10),
          new Point(parseInt(eccGx, 10), parseInt(eccGy, 10)),
          parseInt(eccN, 10)
        );
        const privateKey = parseInt(eccPrivateKey, 10);
        const encryptedPoints = inputText.split(';').map(pt => pt.split(',').map(Number));
        decrypted = ecc.decrypt({ C1: new Point(encryptedPoints[0][0], encryptedPoints[0][1]), C2: new Point(encryptedPoints[1][0], encryptedPoints[1][1]) }, privateKey);
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
        style={styles.input}
        placeholder="Input the text"
        value={inputText}
        onChangeText={setInputText}
        multiline
      />
      <View style={styles.buttonContainer}>
        {['SHA1', 'SHA224'].map((algorithm) => (
          <TouchableOpacity
            key={algorithm}
            style={[styles.button, selectedAlgorithm === algorithm && styles.selectedButton]}
            onPress={() => handleEncrypt(algorithm)}
          >
            <Text>{algorithm}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedAlgorithm('RSA'); }}>
          <Text>RSA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedAlgorithm('AES');}}>
          <Text>AES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedAlgorithm('ECC'); }}>
          <Text>ECC</Text>
        </TouchableOpacity>
      </View>
      {selectedAlgorithm === 'AES' && (
        <View style={styles.aesContainer}>
          <Text style={styles.subHeader}>AES Options</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Output Format:</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity onPress={() => setOutputFormat('Base64')}>
                <Text style={outputFormat === 'Base64' ? styles.radioSelected : styles.radio}>Base64</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOutputFormat('Hex')}>
                <Text style={outputFormat === 'Hex' ? styles.radioSelected : styles.radio}>Hex</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.label}>Key Size:</Text>
          <Picker selectedValue={aesKeySize} style={styles.picker} onValueChange={(itemValue) => setAesKeySize(itemValue)}>
            <Picker.Item label="128" value="128" />
            <Picker.Item label="192" value="192" />
            <Picker.Item label="256" value="256" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Secret Key"
            value={aesKey}
            onChangeText={setAesKey}
          />
          <TextInput
            style={styles.input}
            placeholder="Initialization Vector (Optional)"
            value={aesIv}
            onChangeText={setAesIv}
          />
          <Text style={styles.label}>Mode:</Text>
          <Picker selectedValue={aesMode} style={styles.picker} onValueChange={(itemValue) => setAesMode(itemValue)}>
            <Picker.Item label="CBC" value="CBC" />
            <Picker.Item label="CFB" value="CFB" />
          </Picker>
          <Text style={styles.label}>Padding:</Text>
          <Picker selectedValue={aesPadding} style={styles.picker} onValueChange={(itemValue) => setAesPadding(itemValue)}>
            <Picker.Item label="Pkcs7" value="Pkcs7" />
            <Picker.Item label="AnsiX923" value="AnsiX923" />
            <Picker.Item label="Iso7816" value="Iso7816" />
            <Picker.Item label="ZeroPadding" value="ZeroPadding" />
          </Picker>
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleEncrypt('AES')}>
            <Text style={{ color: '#fff' }}>Encryption</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.encryptButton} onPress={() => handleDecrypt('AES')}>
            <Text style={{ color: '#fff' }}>Decryption</Text>
          </TouchableOpacity>
        </View>
      )}
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
            placeholder="Coefficient a"
            value={eccA}
            onChangeText={setEccA}
          />
          <TextInput
            style={styles.input}
            placeholder="Coefficient b"
            value={eccB}
            onChangeText={setEccB}
          />
          <TextInput
            style={styles.input}
            placeholder="Prime p"
            value={eccP}
            onChangeText={setEccP}
          />
          <TextInput
            style={styles.input}
            placeholder="Base Point Gx"
            value={eccGx}
            onChangeText={setEccGx}
          />
          <TextInput
            style={styles.input}
            placeholder="Base Point Gy"
            value={eccGy}
            onChangeText={setEccGy}
          />
          <TextInput
            style={styles.input}
            placeholder="Order n"
            value={eccN}
            onChangeText={setEccN}
          />
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
  aesContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
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
  picker: {
    marginBottom: 10,
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
})

export default App;
