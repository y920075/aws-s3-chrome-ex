import { S3Client, AWSConfig } from "src/services/aws";
import { queryActiveTab, notifyToUser, createFileFromObjectURL } from "./utils";
import {
  loadConfigFromStorage,
  saveConfigToStorage,
  saveHistoryToStorage,
  loadHistoryFromStorage,
  removeAllHistoryFromStorage,
} from "./storageHelper";
import { ACTION_TYPES } from "./constant";

const UPLOAD_IMAGE = "upload_image";

const client: S3Client = new S3Client();

const setupClient = (config: AWSConfig) => {
  try {
    client.setupClient(config);
    saveConfigToStorage(config);
    chrome.contextMenus.update(UPLOAD_IMAGE, {
      visible: true,
    });
  } catch (error) {
    console.error("setupClient error", error);
  }
};

loadConfigFromStorage().then((config) => {
  if (config) {
    setupClient(config);
  }
});

chrome.contextMenus.create({
  id: UPLOAD_IMAGE,
  type: "normal",
  title: "上傳這張圖片",
  contexts: ["image"],
  visible: false,
});

chrome.runtime.onMessage.addListener(({ type, payload }, _, sendResponse) => {
  switch (type) {
    case ACTION_TYPES.GET_HISTORY: {
      (async () => {
        if (!client.S3Config) return;
        const h = await loadHistoryFromStorage(
          client.S3Config.bucketName,
          client.S3Config.region
        );
        sendResponse(h);
      })();
      return true;
    }
    case ACTION_TYPES.SETUP_CLIENT:
      setupClient(payload);
      sendResponse(ACTION_TYPES.SETUP_CLIENT_SUCCESS);
      break;
    case ACTION_TYPES.GET_CONFIG:
      sendResponse(client.S3Config);
      break;
    case ACTION_TYPES.GET_CLIENT:
      sendResponse(client.S3Client);
      break;
    case ACTION_TYPES.UPLOAD_FILE: {
      (async () => {
        if (!client.S3Config) return;
        const file = await createFileFromObjectURL(payload.objectURL);
        const r = await client.upload(file);

        await saveHistoryToStorage(
          client.S3Config.bucketName,
          client.S3Config.region,
          {
            srcUrl: payload.objectURL,
            s3Url: r.objectUrl,
            status: r.httpStatusCode === 200,
            key: r.key,
            requestId: r.requestId || "-",
          }
        );

        sendResponse(r.objectUrl);
      })();
      return true;
    }
    case ACTION_TYPES.REMOVE_ALL_HISTORY: {
      (async () => {
        try {
          const config = await loadConfigFromStorage();
          if (!config) {
            sendResponse(false);
            return;
          }

          await removeAllHistoryFromStorage(config.bucketName, config.region);
          sendResponse(true);
        } catch (error) {
          sendResponse(false);
        }
      })();
      return true;
    }

    default:
      break;
  }
});

chrome.contextMenus.onClicked.addListener(async function (info) {
  switch (info.menuItemId) {
    case UPLOAD_IMAGE: {
      if (!info.srcUrl || !client.S3Config) return;
      const file = await createFileFromObjectURL(info.srcUrl);
      try {
        notifyToUser("上傳檔案中...");
        const r = await client.upload(file);
        notifyToUser("檔案上傳成功");
        await saveHistoryToStorage(
          client.S3Config.bucketName,
          client.S3Config.region,
          {
            srcUrl: info.srcUrl,
            s3Url: r.objectUrl,
            status: r.httpStatusCode === 200,
            key: r.key,
            requestId: r.requestId || "-",
          }
        );
        try {
          const tabs = await queryActiveTab();
          const tabId = tabs[0].id;
          if (!tabId) return;

          const success = await chrome.tabs.sendMessage(tabId, {
            type: ACTION_TYPES.WRITE_TEXT_TO_CLIPBOARD,
            payload: r.objectUrl,
          });
          notifyToUser(success ? "URL已複製到剪貼簿" : "URL複製到剪貼簿失敗");
        } catch (error) {
          console.error(error);
          notifyToUser(
            "URL複製到剪貼簿失敗: " +
              (error instanceof Error ? error.message : "")
          );
        }
      } catch (error) {
        console.error(error);
        notifyToUser("上傳失敗");
      }

      break;
    }
  }
});
