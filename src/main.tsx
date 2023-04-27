import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import "./index.css";

import S3Provider from "./contexts/S3Provider.tsx";

const client = new QueryClient();

chrome.runtime.onMessage.addListener((message) => {
  console.log("chrome ext onMessage", message);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <S3Provider>
        <App />
      </S3Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
