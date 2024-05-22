const S3 = require("aws-sdk/clients/s3");

const generateHTMl = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sprinklr Demo</title>
      </head>
      <body>
        <p>Hi this is Aditya. This webpage was last built on ${Date.toString()}</p>
      </body>
    </html>
    `;
};

const uploadToAWS = async () => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    if (!bucketName) {
      throw new Error("No bucket name found!");
    }

    console.log("Starting static asset upload...");

    const { accessKeyId, secretAccessKey, sessionToken } = JSON.parse(
      process.env.AWS_TEMPORARY_CREDS
    );

    const s3 = new S3({
      accessKeyId,
      secretAccessKey,
      sessionToken,
    });

    const upload = new S3.ManagedUpload({
      service: s3,
      params: {
        Bucket: bucketName,
        Key: "index.html",
        Body: generateHTMl(),
        CacheControl: "public, max-age=0, must-revalidate",
        ContentType: "text/html",
        ACL: "public-read",
      },
    });

    await upload.promise();

    console.log("Upload complete");
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
};

module.exports = { uploadToAWS };
