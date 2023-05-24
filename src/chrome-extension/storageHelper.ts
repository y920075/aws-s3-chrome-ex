import type { AWSConfig } from "src/services/aws";

const CHROME_STORAGE_KEY = "AWS_CONFIG";
const chromeStorage = chrome?.storage?.local;

// History
type HistoryData = {
  srcUrl: string;
  s3Url: string;
  status: boolean;
  key: string;
  requestId: string;
};
const loadHistoryFromStorage = async (
  bucketName: string,
  region: string
): Promise<HistoryData[]> => {
  if (!chromeStorage) {
    return [];
  }

  const result = await chromeStorage.get(region);
  const _r = result[region][bucketName];
  if (_r) {
    return _r as HistoryData[];
  } else {
    return [];
  }
};
const saveHistoryToStorage = async (
  bucketName: string,
  region: string,
  history: HistoryData
) => {
  if (!chromeStorage) {
    return;
  }

  const oldHistory = await loadHistoryFromStorage(bucketName, region);
  const newHistory = [history, ...oldHistory];
  chromeStorage.set({ [region]: { [bucketName]: newHistory } });
};
const removeHistoryFromStorage = async (
  bucketName: string,
  region: string,
  key: string
) => {
  if (!chromeStorage) {
    return;
  }

  const oldHistory = await loadHistoryFromStorage(bucketName, region);
  const newHistory = oldHistory.filter((item: HistoryData) => item.key !== key);
  chromeStorage.set({ [region]: { [bucketName]: newHistory } });
};
const removeAllHistoryFromStorage = async (
  bucketName: string,
  region: string
) => {
  if (!chromeStorage) {
    return;
  }
  chromeStorage.set({ [region]: { [bucketName]: [] } });
};

export {
  loadHistoryFromStorage,
  saveHistoryToStorage,
  removeHistoryFromStorage,
  removeAllHistoryFromStorage,
};

// Config
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

export { loadConfigFromStorage, saveConfigToStorage, removeConfigFromStorage };
export type { HistoryData };
