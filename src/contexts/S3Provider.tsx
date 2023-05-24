import { createContext, useCallback, useState, useEffect } from "react";
import {
  useMutation,
  UseMutationResult,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";

import { ACTION_TYPES } from "src/chrome-extension/constant";
import type { HistoryData } from "src/chrome-extension/storageHelper";
import type { AWSConfig } from "src/services/aws";

type S3ProviderContext = {
  clientIsSetup: boolean;
  clear: () => void;
  setup: (config: AWSConfig) => void;
  getConfig: () => Promise<AWSConfig | null>;
  useUploadFile: () => UseMutationResult<string, unknown, File, unknown>;
  useGetHistory: () => UseQueryResult<HistoryData[], unknown>;
};

const Context = createContext<S3ProviderContext>({} as S3ProviderContext);

const S3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientIsSetup, setClientIsSetup] = useState(false);

  const setup = useCallback(async (config: AWSConfig) => {
    const result = await chrome.runtime.sendMessage({
      type: ACTION_TYPES.SETUP_CLIENT,
      payload: config,
    });
    setClientIsSetup(result === ACTION_TYPES.SETUP_CLIENT_SUCCESS);
  }, []);

  const getConfig = useCallback(async () => {
    const config = await chrome.runtime.sendMessage({
      type: "getConfig",
    });

    return config as AWSConfig | null;
  }, []);

  const getHistory = useCallback(async () => {
    const history = await chrome.runtime.sendMessage({
      type: ACTION_TYPES.GET_HISTORY,
    });
    return (history as HistoryData[]) || [];
  }, []);

  const upload = async (file: File) => {
    if (!clientIsSetup) {
      throw new Error("Client is not setup");
    }

    const fileURL = URL.createObjectURL(file);
    const url = await chrome.runtime.sendMessage({
      type: ACTION_TYPES.UPLOAD_FILE,
      payload: { objectURL: fileURL, type: file.type },
    });
    URL.revokeObjectURL(fileURL);
    return url as string;
  };

  const clear = () => {
    setClientIsSetup(false);
  };

  const useUploadFile = () => useMutation(upload);
  const useGetHistory = () => useQuery(["History "], getHistory);

  useEffect(() => {
    (async () => {
      let sendMsg = true;
      while (sendMsg) {
        const client = await chrome.runtime.sendMessage({
          type: ACTION_TYPES.GET_CLIENT,
        });
        setClientIsSetup(client !== null);
        sendMsg = client === null;
      }
    })();
  }, []);

  return (
    <Context.Provider
      value={{
        clear,
        setup,
        getConfig,
        clientIsSetup,
        useUploadFile,
        useGetHistory,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default S3Provider;
export { Context };
