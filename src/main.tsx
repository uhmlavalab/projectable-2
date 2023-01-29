import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { StoreProvider } from "./store/useStore";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
