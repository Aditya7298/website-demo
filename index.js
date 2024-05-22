const { generateTemporaryCreds } = require("./generate-creds.js");
const { retrieveSecrets } = require("./retrieve-secrets.js");
const { uploadToAWS } = require("./deploy-content.js");
const { invalidateCache } = require("./invalidate-cache.js");

const main = async () => {
  await generateTemporaryCreds();
  await retrieveSecrets();
  await uploadToAWS();
  await invalidateCache();
};

main();
