import { generateTemporaryCreds } from "./generate-creds.js";
import { retrieveSecrets } from "./retrieve-secrets.js";
import { uploadToAWS } from "./deploy-content.js";
import { invalidateCache } from "./invalidate-cache.js";

export const main = async () => {
  await generateTemporaryCreds();
  await retrieveSecrets();
  await uploadToAWS();
  await invalidateCache();
};
