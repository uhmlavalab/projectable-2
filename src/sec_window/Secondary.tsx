import "./Secondary.css";
import { useStore } from "../store/useStore";

function SecondaryWindow() {
  const { uiState } = useStore();

  return (
    <div id="app">
      <div>
        <h1>Projectable 2.0</h1>
      </div>
      <div className="card">
        <h3>Electron Store</h3>
        Count: {uiState.countValue}
      </div>
    </div>
  );
}

export default SecondaryWindow;
