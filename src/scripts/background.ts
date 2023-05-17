import {
  S3Client,
  AWSConfig,
  loadConfigFromStorage,
  saveConfigToStorage,
} from "src/services/aws";

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

const queryActiveTab = () =>
  chrome.tabs.query({
    active: true,
  });

const notifyToUser = (message: string) => {
  chrome.notifications.create({
    message: message,
    title: "AWS S3 Uploader",
    type: "basic",
    iconUrl: "./images/aws-32.png",
  });
};

const parseExt = (url: string) => {
  if (url.startsWith("data:image/")) {
    // 取得 data image/ 後面的副檔名
    const ext = url.split(";")[0].split("/")[1] || "png";
    return ext;
  }
  return url.split(".").pop() || "png";
};

chrome.contextMenus.create({
  id: UPLOAD_IMAGE,
  type: "normal",
  title: "上傳這張圖片",
  contexts: ["image"],
  visible: false,
});

chrome.runtime.onMessage.addListener(({ type, payload }, _, sendResponse) => {
  switch (type) {
    case "setupClient":
      setupClient(payload);
      sendResponse("setupClientSuccess");
      break;
    case "getConfig":
      sendResponse(client.S3Config);
      break;
    case "getClient":
      sendResponse(client.S3Client);
      break;
    case "uploadFile": {
      (async () => {
        const blob = await fetch(payload.objectURL).then((r) => r.blob());
        const ext = blob.type.split("/").pop() || "png";
        const file = new File([blob], `image.${ext}`, { type: blob.type });
        sendResponse(await client.upload(file));
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
      if (!info.srcUrl) {
        return;
      }

      const blob = await fetch(info.srcUrl).then((r) => r.blob());
      const ext = parseExt(info.srcUrl);
      const file = new File([blob], `image.${ext}`, { type: blob.type });
      try {
        const url = await client.upload(file);
        const tabs = await queryActiveTab();
        const tabId = tabs[0].id;
        if (!tabId) return;

        const success = await chrome.tabs.sendMessage(tabId, {
          type: "writeTextToClipboard",
          payload: url,
        });
        notifyToUser(success ? "已複製到剪貼簿" : "複製失敗");
      } catch (error) {
        notifyToUser("上傳失敗");
      }

      break;
    }
  }
});
