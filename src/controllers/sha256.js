const crypto = require("crypto")

const encrypt = (plainText, password) => {
  try {
        
    // var plainText = "Hello World"
    // var password = "secret1234"

    var iv = crypto.randomBytes(16);
    var key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    var encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex');

  } catch (error) {
    console.log(error);
  }
}

const decrypt = (encryptedText, password) => {
    try {
      const textParts = encryptedText.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
  
      const encryptedData = Buffer.from(textParts.join(':'), 'hex');
      const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      const decrypted = decipher.update(encryptedData);
      const decryptedText = Buffer.concat([decrypted, decipher.final()]);
      return decryptedText.toString();
    } catch (error) {
      console.log(error)
    }
  }

    // const text = "Hello World"
    // const pass = "secret1234"

    const encText = encrypt(text, pass)
    console.log('encrypted text', encText);

    const decText = decrypt(encText, pass)
    console.log('decrypted text', decText);

