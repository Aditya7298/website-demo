import { generateTemporaryCreds } from "./generate-creds";
import { retrieveSecrets } from "./retrieve-secrets";
import { uploadToAWS } from "./deploy-content";
import { invalidateCache } from "./invalidate-cache";

export const main = async () => {
  await generateTemporaryCreds();
  await retrieveSecrets();
  await uploadToAWS();
  await invalidateCache();
};
