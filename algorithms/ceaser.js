const caesarCipher = {
    encrypt: (text, shift) => {
      return text.split('').map(char => {
        const charCode = char.charCodeAt(0);
        if (char >= 'a' && char <= 'z') {
          return String.fromCharCode((charCode - 97 + shift) % 26 + 97);
        } else if (char >= 'A' && char <= 'Z') {
          return String.fromCharCode((charCode - 65 + shift) % 26 + 65);
        } else {
          return char;
        }
      }).join('');
    },
    decrypt: (text, shift) => {
      return caesarCipher.encrypt(text, 26 - shift);
    }
  };
  
  module.exports = caesarCipher;
  