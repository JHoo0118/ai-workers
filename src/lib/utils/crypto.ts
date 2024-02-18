import { AES, enc, lib, mode, pad } from "crypto-js";

export class CryptoUtils {
  private static instance: CryptoUtils;
  private _key: lib.WordArray;
  private _iv: lib.WordArray;

  private constructor() {
    this._key = enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_PBSZ_USER_KEY!);
    this._iv = enc.Utf8.parse(
      process.env.NEXT_PUBLIC_AES_PBSZ_IV!.substring(0, 16),
    );
  }

  public static getInstance(): CryptoUtils {
    if (!CryptoUtils.instance) {
      CryptoUtils.instance = new CryptoUtils();
    }
    return CryptoUtils.instance;
  }

  encryptAes(value: string): string {
    const cipher = AES.encrypt(enc.Utf8.parse(value), this._key, {
      iv: this._iv,
      padding: pad.Pkcs7,
      mode: mode.CBC,
    });
    return cipher
      .toString()
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  decryptAes(encryptedValue: string): string {
    const base64 = encryptedValue.replace(/-/g, "+").replace(/_/g, "/");
    const cipher = AES.decrypt(base64, this._key, {
      iv: this._iv,
      padding: pad.Pkcs7,
      mode: mode.CBC,
    });
    return cipher.toString(enc.Utf8);
  }
}
