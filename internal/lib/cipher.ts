function vigenereEncrypt(plaintext: string, key: string): string {
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Key must contain at least one letter");

  let ki = 0;
  return plaintext
    .split("")
    .map((ch) => {
      const code = ch.toUpperCase().charCodeAt(0);
      if (code < 65 || code > 90) return ch;
      const shift = k.charCodeAt(ki % k.length) - 65;
      ki++;
      const encrypted = ((code - 65 + shift) % 26) + 65;
      return String.fromCharCode(encrypted);
    })
    .join("");
}

export function vigenereDecrypt(ciphertext: string, key: string): string {
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Key must contain at least one letter");

  let ki = 0;
  return ciphertext
    .split("")
    .map((ch) => {
      const code = ch.toUpperCase().charCodeAt(0);
      if (code < 65 || code > 90) return ch;
      const shift = k.charCodeAt(ki % k.length) - 65;
      ki++;
      const decrypted = ((code - 65 - shift + 26) % 26) + 65;
      return String.fromCharCode(decrypted);
    })
    .join("");
}

// --- Pre-computed M5 cipher ---

const M5_PLAINTEXT = [
  "ANDY ORDERED THE KILLING. BAO CARRIED IT OUT.",
  "THE BODY ON THE DESK IS KIEN, KAIS IDENTICAL TWIN.",
  "KAI IS ALIVE. HE BOARDS GATE 17 AT 0600.",
  "THE NAMELESS SEAT FROM MILESTONE TWO.",
  "CATCH HIM BEFORE DAWN.",
].join(" ");

export const M5_KEY = "THEIA";

const M5_ENCRYPTED = vigenereEncrypt(M5_PLAINTEXT, M5_KEY);

export const M5_CIPHERTEXT_B64 = Buffer.from(M5_ENCRYPTED).toString("base64");

export function verifyM5Answer(input: string): boolean {
  const normalized = input.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized.includes("gate17");
}
