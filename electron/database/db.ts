import { join } from "node:path";
import { Low, JSONFile } from "lowdb";

import { Post } from "shared/schemas";

// File path
const file = join(__dirname, "db.json");

type Data = {
  posts: Post[];
};

class Database {
  private db: Low<Data>;
  constructor() {
    // Configure lowdb to write to JSONFile
    const adapter = new JSONFile<Data>(file);
    this.db = new Low(adapter);
  }

  public async init() {
    // Read data from JSON file, this will set db.data content
    await this.db.read();
    this.db.data ||= { posts: [] };
  }

  public addPost(post: Post) {
    // Alternatively, you can also use this syntax if you prefer
    const posts = this.db.data.posts;
    posts.push(post);
    this.write();
  }

  public removePost(id: string) {
    const posts = this.db.data.posts;
    const idx = posts.findIndex((el) => el.id === id);
    if (idx > -1) {
      posts.splice(idx, 1);
    }
    this.db.data.posts = posts;
    this.write();
  }

  public getPosts() {
    return this.db.data.posts;
  }

  private write() {
    this.db.write();
  }
}

export const DB = new Database();
