import { createContext, useCallback, useState, useEffect } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

import type { AWSConfig } from "src/services/aws";

type S3ProviderContext = {
  clientIsSetup: boolean;
  clear: () => void;
  setup: (config: AWSConfig) => void;
  getConfig: () => Promise<AWSConfig | null>;
  useUploadFile: () => UseMutationResult<string, unknown, File, unknown>;
};

const Context = createContext<S3ProviderContext>({} as S3ProviderContext);

const S3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientIsSetup, setClientIsSetup] = useState(false);

  const setup = useCallback(async (config: AWSConfig) => {
    const result = await chrome.runtime.sendMessage({
      type: "setupClient",
      payload: config,
    });
    setClientIsSetup(result === "setupClientSuccess");
  }, []);

  const getConfig = useCallback(async () => {
    const config = await chrome.runtime.sendMessage({
      type: "getConfig",
    });

    return config as AWSConfig | null;
  }, []);

  const upload = async (file: File) => {
    if (!clientIsSetup) {
      throw new Error("Client is not setup");
    }

    const fileURL = URL.createObjectURL(file);
    const url = await chrome.runtime.sendMessage({
      type: "uploadFile",
      payload: { objectURL: fileURL, type: file.type },
    });
    URL.revokeObjectURL(fileURL);
    return url;
  };

  const clear = () => {
    setClientIsSetup(false);
  };

  const useUploadFile = () => useMutation(upload);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        type: "getClient",
      },
      (client) => {
        setClientIsSetup(client !== null);
      }
    );
  }, []);

  return (
    <Context.Provider
      value={{ clear, setup, getConfig, clientIsSetup, useUploadFile }}
    >
      {children}
    </Context.Provider>
  );
};

export default S3Provider;
export { Context };
