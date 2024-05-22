const { config } = require("dotenv-flow");
const SecretsManager = require("aws-sdk/clients/secretsmanager");

const retrieveSecrets = async () => {
  console.log("Retrieving secrets...");

  const { parsed } = config();

  console.log("Env file loaded. Logging env variables below.");
  console.log(parsed);

  const secretName = parsed?.AWS_SECRET_NAME;
  if (!secretName) {
    throw new Error(
      "Error while fetching secrets: Unable to load AWS_SECRET_NAME from env file."
    );
  }

  const secretsManager = new SecretsManager({
    region: parsed.AWS_REGION_NAME,
    credentials: JSON.parse(process.env.AWS_TEMPORARY_CREDS),
  });

  return new Promise((res, rej) => {
    console.log("Fetching secrets from AWS...");

    secretsManager.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        rej(`Error while fetching secrets from AWS: ${err}`);
        return;
      }

      const { SecretString } = data;
      if (!SecretString) {
        rej(`Error while fetching secrets from AWS: SecretString was empty`);
        return;
      }

      const parsedSecretString = JSON.parse(SecretString);

      Object.keys(parsedSecretString).forEach((secret) => {
        process.env[secret] = parsedSecretString[secret];
      });

      console.log("Secrets fetched from AWS. Proceeding to next step.");
      res();
    });
  });
};

module.exports = { retrieveSecrets };
