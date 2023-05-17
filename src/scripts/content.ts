// 在 onMessage 的 callback 中，使用非同步任務的話，需要回傳 true
// 參考：https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
// 官方文件：https://developer.chrome.com/docs/extensions/mv3/messaging/#simple

chrome.runtime.onMessage.addListener(({ type, payload }, _, sendResponse) => {
  switch (type) {
    case "writeTextToClipboard":
      (async () => {
        try {
          await navigator.clipboard.writeText(payload);
          sendResponse(true);
        } catch (error) {
          sendResponse(false);
        }
      })();

      // 使用非同步任務的話，需要回傳 true
      return true;
  }
});
