import * as AWS from "@aws-sdk/client-s3";

const CHROME_STORAGE_KEY = "AWS_CONFIG";
const chromeStorage = chrome?.storage?.local;

type AWSConfig = {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

const loadConfigFromStorage = async () => {
  if (!chromeStorage) {
    return null;
  }

  const result = await chromeStorage.get(CHROME_STORAGE_KEY);
  if (
    result[CHROME_STORAGE_KEY] &&
    typeof result[CHROME_STORAGE_KEY].bucketName === "string" &&
    typeof result[CHROME_STORAGE_KEY].region === "string" &&
    typeof result[CHROME_STORAGE_KEY].accessKeyId === "string" &&
    typeof result[CHROME_STORAGE_KEY].secretAccessKey === "string"
  ) {
    return result[CHROME_STORAGE_KEY] as AWSConfig;
  } else {
    return null;
  }
};

const getObjectUrl = (key: string, bucketName: string, region: string) => {
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

const saveConfigToStorage = (config: AWSConfig) => {
  if (!chromeStorage) {
    return;
  }

  chromeStorage.set({ [CHROME_STORAGE_KEY]: config });
};

const removeConfigFromStorage = () => {
  if (!chromeStorage) {
    return;
  }

  chromeStorage.remove(CHROME_STORAGE_KEY);
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
      await this.client.send(command);
      return getObjectUrl(key, this.config.bucketName, this.config.region);
    } catch (error) {
      console.log(`Error uploading file: ${JSON.stringify(error)} `);
      throw error;
    }
  };
}

export {
  loadConfigFromStorage,
  saveConfigToStorage,
  removeConfigFromStorage,
  S3Client,
};
export type { AWSConfig };
