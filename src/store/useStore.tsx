import React, { createContext, useContext, useEffect, useState } from "react";

import { parse, ParseResult } from "papaparse";
import { UIState, UIStateDefault } from "../schemas";

import { ipcRenderer } from "electron";
const tesurl = "./data/test.csv";

type WinName = "main" | "secondary" | "pending";

const StoreContext = createContext({
  uiState: UIStateDefault,
  users: [],
  winName: "pending" as WinName,
  updateUI: (newpost: Partial<UIState>) => {},
});

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  const [uiState, setUIState] = useState<UIState>(UIStateDefault);

  const [users, setUsers] = useState([]);

  const [winName, setWinName] = useState<WinName>("pending");

  useEffect(() => {
    parse(tesurl, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results: ParseResult<Record<string, unknown>>) {
        setUsers(results.data as []);
      },
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on("ui-event-update", (evt, message) => {
      setUIState(message.ui);
    });
    ipcRenderer.on("window-name", (evt, message) => {
      setWinName(message.name);
    });
  }, []);

  /**
   * Update UI State
   * @param update Updates to the UI
   */
  const updateUI = (update: Partial<UIState>) => {
    ipcRenderer.send("ui-update", { update });
  };

  return (
    <StoreContext.Provider value={{ uiState, users, updateUI, winName }}>
      {props.children}
    </StoreContext.Provider>
  );
}
