import CloudFront from "aws-sdk/clients/cloudfront";
import { config } from "dotenv-flow";

export const invalidateCache = async () => {
  const { parsed } = config();

  const cloudFront = new CloudFront({
    region: parsed.AWS_REGION_NAME,
    ...(process.env.AWS_TEMPORARY_CREDS
      ? { credentials: JSON.parse(process.env.AWS_TEMPORARY_CREDS) }
      : undefined),
  });

  return new Promise((res, rej) => {
    cloudFront.createInvalidation(
      {
        DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: {
            Quantity: 1,
            Items: ["/*"],
          },
        },
      },
      (err) => {
        if (err) {
          console.error(`Cloudfront invalidation error: ${err}`);
          rej(err);
        } else {
          console.log("Cloudfront invalidation successful.");
          res();
        }
      }
    );
  });
};
