// Mock for expo/src/winter — prevents the lazy-getter require issue in Jest.
if (typeof globalThis.__ExpoImportMetaRegistry === 'undefined') {
  globalThis.__ExpoImportMetaRegistry = { url: '' };
}
