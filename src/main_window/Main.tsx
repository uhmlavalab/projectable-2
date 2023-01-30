import "./Main.css";
import { useStore } from "../store/useStore";

function MainWindow() {
  const { users, uiState, updateUI } = useStore();

  const incCount = () => {
    updateUI({ countValue: uiState.countValue + 1 });
  };

  const decCount = () => {
    updateUI({ countValue: uiState.countValue - 1 });
  };

  return (
    <div id="app">
      <div>
        <h1>Projectable 2.0</h1>
      </div>

      <div className="card">
        <h3>CSV File</h3>
        {users.map((u: any) => {
          return (
            <div key={u.name}>
              {u.name} | {u.age} | {u.sex}
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3>Electron Store</h3>
        Count: {uiState.countValue}
        <button onClick={incCount}> Increase</button>
        <button onClick={decCount}> Decrease</button>
      </div>
    </div>
  );
}

export default MainWindow;
