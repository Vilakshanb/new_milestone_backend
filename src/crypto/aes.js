import CryptoJS from "crypto-js";
const crypto = require("crypto");

const secret_key = "8080808080808080";
const your_secret_iv = "8080808080808080";

export const aesEncrypt = (content) => {
  const parsedkey = CryptoJS.enc.Utf8.parse(secret_key);
  const iv = CryptoJS.enc.Utf8.parse(your_secret_iv);
  const encrypted = CryptoJS.AES.encrypt(content, parsedkey, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  console.log(encrypted, "AD");
  return encrypted.toString();
};

export const aesDecrypt = (word) => {
  var keys = CryptoJS.enc.Utf8.parse(secret_key);
  let base64 = CryptoJS.enc.Base64.parse(word);
  let src = CryptoJS.enc.Base64.stringify(base64);
  var decrypt = CryptoJS.AES.decrypt(src, keys, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  console.log(decrypt.toString());
  return decrypt.toString(CryptoJS.enc.Utf8);
};

export const encryptAes = (plainText, outputEncoding = "base64") => {
  const cipher = crypto.createCipheriv("aes-128-cbc", secret_key, your_secret_iv);
  return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(outputEncoding);
};

export const decryptAes = (cipherText, outputEncoding = "utf8") => {
  const cipher = crypto.createDecipheriv("aes-128-cbc", secret_key, your_secret_iv);
  return Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(outputEncoding);
};
