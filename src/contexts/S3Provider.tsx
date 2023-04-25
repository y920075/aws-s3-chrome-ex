import { createContext, useCallback, useEffect, useState } from "react";
import * as AWS from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

const CHROME_STORAGE_KEY = "AWS_CONFIG";
const chromeStorage = chrome?.storage?.local;

type AWSConfig = {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

type S3ProviderContext = {
  setup: (config: AWSConfig) => void;
  useUploadFile: () => UseMutationResult<string, unknown, File, unknown>;
  client: AWS.S3 | null;
};

const Context = createContext<S3ProviderContext>({} as S3ProviderContext);

const loadConfigFromStorage = () =>
  new Promise<AWSConfig | null>((resolve) => {
    if (chromeStorage) {
      chromeStorage.get(CHROME_STORAGE_KEY, (result) => {
        if (
          result[CHROME_STORAGE_KEY] &&
          result[CHROME_STORAGE_KEY].bucketName &&
          result[CHROME_STORAGE_KEY].region &&
          result[CHROME_STORAGE_KEY].accessKeyId &&
          result[CHROME_STORAGE_KEY].secretAccessKey
        ) {
          resolve(result[CHROME_STORAGE_KEY] as AWSConfig);
        } else {
          resolve(null);
        }
      });
    } else {
      resolve(null);
    }
  });

const S3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<AWS.S3 | null>(null);
  const [config, setConfig] = useState<AWSConfig | null>(null);

  const getObjectUrl = (key: string) => {
    if (config === null) {
      throw new Error("Config is null");
    }
    return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
  };

  const setup = useCallback((config: AWSConfig) => {
    const client = new AWS.S3({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    if (chromeStorage) {
      chromeStorage.set({ [CHROME_STORAGE_KEY]: config });
    }

    setConfig(config);
    setClient(client);
  }, []);

  const upload = async (file: File) => {
    if (client === null || config === null) {
      throw new Error("Client or config is null");
    }
    const fileExtension = file.name.split(".").pop();
    const key = uuidv4() + `${fileExtension ? "." + fileExtension : ""}`;

    const params: AWS.PutObjectCommandInput = {
      Bucket: config.bucketName,
      Key: key,
      Body: file,
    };

    try {
      const command = new AWS.PutObjectCommand(params);
      await client.send(command);
      return getObjectUrl(key);
    } catch (error) {
      console.log(`Error uploading file: ${JSON.stringify(error)} `);
      throw error;
    }
  };

  const useUploadFile = () => useMutation(upload);

  useEffect(() => {
    loadConfigFromStorage().then((config) => {
      if (config !== null) {
        setup(config);
      }
    });
  }, [setup]);

  return (
    <Context.Provider
      value={{
        setup,
        client,
        useUploadFile,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default S3Provider;
export { Context };
