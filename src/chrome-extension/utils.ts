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

const createFileFromObjectURL = async (objectURL: string) => {
  const blob = await fetch(objectURL).then((r) => r.blob());
  const ext = blob.type.split("/").pop()?.replace("+xml", "") || "png";
  const file = new File([blob], `image.${ext}`, { type: blob.type });
  return file;
};

export { queryActiveTab, notifyToUser, createFileFromObjectURL };
