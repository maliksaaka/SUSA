// SUSA site settings. Edit and redeploy.
window.SUSA_CONFIG = {
  // Shop gate. false = Shop shows "coming soon" plus a password box. true = shop is public, no gate.
  shopOpen: false,

  // SHA-256 hash of the shop preview password (the plaintext is not stored here).
  // To change it: run   printf 'NEWPASSWORD' | sha256sum   (or: echo -n 'NEWPASSWORD' | shasum -a 256 on a Mac)
  // and paste the 64-character result below.
  // Shopify (Storefront API, public Buy Button token: safe to ship in client code)
  shopifyDomain: 'subtleurbansexappeal.myshopify.com',
  shopifyToken: '6091baef9e4c3371bf329fb5bc74d96c',
  shopifyApiVersion: '2025-01',

  // About page photo flip speed, in milliseconds (random between min and max)
  aboutFlipMinMs: 60,
  aboutFlipMaxMs: 90,

  // GoatCounter visitor stats. Leave empty to disable. Set to your code, e.g. 'susa' for susa.goatcounter.com
  goatcounter: '',

  shopPasswordHash: 'd2675c478d2ce4c97607e30cb39181e633d9b51caf7d3443180fae3911119297'
};
