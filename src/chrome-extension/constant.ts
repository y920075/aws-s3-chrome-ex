const ACTION_TYPES = {
  WRITE_TEXT_TO_CLIPBOARD: "writeTextToClipboard",
  SETUP_CLIENT: "setupClient",
  SETUP_CLIENT_SUCCESS: "setupClientSuccess",
  GET_CONFIG: "getConfig",
  GET_CLIENT: "getClient",
  GET_HISTORY: "getHistory",
  UPLOAD_FILE: "uploadFile",
  REMOVE_ALL_HISTORY: "removeAllHistory",
} as const;

export { ACTION_TYPES };
