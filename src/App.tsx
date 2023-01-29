import { useState } from "react";
import MainWindow from "./main_window/Main";
import SecondaryWindow from "./sec_window/Secondary";
import { useStore } from "./store/useStore";

function App() {
  const { winName } = useStore();
  if (winName === "main") return <MainWindow />;
  else if (winName === "secondary") return <SecondaryWindow />;
  else return <div>Loading...</div>;
}

export default App;
