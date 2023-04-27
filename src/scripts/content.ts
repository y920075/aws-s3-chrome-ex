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

    // case "readImageFromClipboard": {
    //   (async () => {
    //     const items = await navigator.clipboard.read();
    //     console.log(items);
    //     let blob: Blob | null = null;
    //     let ext = "png";
    //     for (const item of items) {
    //       for (const type of item.types) {
    //         console.log({ type });
    //         await item.getType(type).then(console.log);

    //         if (type.startsWith("image")) {
    //           blob = await item.getType(type);
    //           ext = type.split("/").pop() || "png";
    //           console.log({ blob, ext, type, items });
    //         }
    //       }
    //     }

    //     sendResponse({ blob, ext });
    //   })();
    //   // 使用非同步任務的話，需要回傳 true
    //   return true;
    // }
  }
});
