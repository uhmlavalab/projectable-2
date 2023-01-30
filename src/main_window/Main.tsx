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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUI({ sliderValue: Number(e.target.value) });
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
        <h4>Count</h4>
        <span>
          <button onClick={incCount}>INC +</button>
          <button onClick={decCount}>DEC -</button>
        </span>
        <br />
        <h4>Slider</h4>
        <input
          type="range"
          min="1"
          max="200"
          value={uiState.sliderValue}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  );
}

export default MainWindow;
