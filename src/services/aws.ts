import * as AWS from "@aws-sdk/client-s3";

type AWSConfig = {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

const getObjectUrl = (key: string, bucketName: string, region: string) => {
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

class S3Client {
  private client: AWS.S3Client | null = null;
  private config: AWSConfig | null = null;

  public setupClient = (config: AWSConfig) => {
    if (
      typeof config.accessKeyId !== "string" ||
      typeof config.secretAccessKey !== "string" ||
      typeof config.region !== "string" ||
      typeof config.bucketName !== "string"
    ) {
      throw new Error("Invalid config");
    }
    this.config = config;

    this.client = new AWS.S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  };

  get S3Config() {
    return this.config;
  }
  get S3Client() {
    return this.client;
  }

  public upload = async (file: File) => {
    if (!this.client || !this.config) {
      throw new Error("S3Client is not setup");
    }
    const fileExtension = file.name.split(".").pop();
    const key =
      Date.now().toString() + `${fileExtension ? "." + fileExtension : ""}`;

    const params: AWS.PutObjectCommandInput = {
      Bucket: this.config.bucketName,
      Key: key,
      Body: file,
    };

    try {
      const command = new AWS.PutObjectCommand(params);
      const result = await this.client.send(command);
      console.log(`File uploaded`, result);

      const r = {
        key,
        requestId: result.$metadata.requestId,
        httpStatusCode: result.$metadata.httpStatusCode,
        eTag: result.ETag,
        objectUrl: getObjectUrl(
          key,
          this.config.bucketName,
          this.config.region
        ),
      };

      return r;
    } catch (error) {
      console.log(`Error uploading file: ${JSON.stringify(error)} `);
      throw error;
    }
  };
}

export { S3Client };
export type { AWSConfig };
