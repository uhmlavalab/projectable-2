import { useState } from "react";
import "./Main.css";
import { Post } from "shared/schemas";
import { useStore } from "../store/useStore";

function MainWindow() {
  const [count, setCount] = useState(0);
  const { users, posts, addPost, removePost } = useStore();

  const addNewPost = () => {
    const id = Math.floor(Math.random() * 1000).toString();
    const newPost = {
      text: "Hello ",
      timestamp: Date.now(),
      id: id,
    } as Post;
    addPost(newPost);
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
        {posts.map((p) => {
          return (
            <div key={p.id}>
              {p.text} : {p.id}
              <button
                onClick={() => removePost(p.id)}
                className="delete-button"
              >
                delete
              </button>
            </div>
          );
        })}
        <button onClick={addNewPost}> Add</button>
      </div>

      <div className="card">
        <h3>Local State</h3>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default MainWindow;
