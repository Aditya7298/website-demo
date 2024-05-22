const { STS } = require("aws-sdk");
const { config } = require("dotenv-flow");

const generateTemporaryCreds = async () => {
  console.log("Generating temporary AWS creds for cross account access...");

  const { parsed } = config();

  const awsRoleArn = parsed?.AWS_ROLE_ARN;

  if (!awsRoleArn) {
    throw new Error("No AWS_ROLE_ARN found in env!!");
  }

  const sts = new STS();

  return new Promise((res, rej) => {
    sts.assumeRole(
      {
        RoleArn: awsRoleArn,
        RoleSessionName: "sprmarketing-build-deploy",
        DurationSeconds: 900,
      },
      (err, data) => {
        if (err) {
          rej(err);
          return;
        }

        const { AccessKeyId, SecretAccessKey, SessionToken } =
          data.Credentials ?? {};

        if (!AccessKeyId || !SecretAccessKey) {
          rej(
            "No accessKey or secretAccessKey could be generated from Assume Role."
          );
        }

        process.env.AWS_TEMPORARY_CREDS = JSON.stringify({
          accessKeyId: AccessKeyId,
          secretAccessKey: SecretAccessKey,
          sessionToken: SessionToken,
        });

        console.log("Temporary creds successfully generated");
        res();
      }
    );
  });
};

module.exports = { generateTemporaryCreds };
