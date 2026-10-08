// Server-side stub for @zxing/library to prevent bundling 1MB+ barcode engine into SSR server chunks
export class BrowserMultiFormatReader {
  decodeFromCanvas() {
    return null;
  }
}

export const BarcodeFormat = {};

export default {
  BrowserMultiFormatReader,
  BarcodeFormat,
};
