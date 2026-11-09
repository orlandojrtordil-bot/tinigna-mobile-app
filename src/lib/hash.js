import * as Crypto from 'expo-crypto';

export async function sha256(text) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

export async function randomId(bytes = 16) {
  const b = await Crypto.getRandomBytesAsync(bytes);
  return Array.from(b).map(x => x.toString(16).padStart(2, '0')).join('');
}
