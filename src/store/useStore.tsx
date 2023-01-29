import React, { createContext, useContext, useEffect, useState } from "react";

import { parse, ParseResult } from "papaparse";
import { Post, User } from "@schemas";

import { ipcRenderer } from "electron";
const tesurl = "./data/test.csv";

type WinName = "main" | "secondary" | "pending";

const StoreContext = createContext({
  users: [] as User[],
  posts: [] as Post[],
  winName: "pending" as WinName,
  addPost: (newpost: Post) => {},
  removePost: (id: string) => {},
});

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  const [posts, setPosts] = useState<Post[]>([]);

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
    ipcRenderer.on("posts-list", (evt, message) => {
      setPosts(message.posts);
    });
    ipcRenderer.on("window-name", (evt, message) => {
      setWinName(message.name);
    });
  }, []);

  /**
   * Create a new post
   * @param post Post to create
   */
  const addPost = (newpost: Post) => {
    ipcRenderer.send("posts-add", { post: newpost });
  };

  /**
   * Remove a post
   * @param id Id of post to remove
   */
  const removePost = (id: string) => {
    ipcRenderer.send("posts-remove", { id });
  };

  return (
    <StoreContext.Provider
      value={{ users, posts, addPost, removePost, winName }}
    >
      {props.children}
    </StoreContext.Provider>
  );
}
