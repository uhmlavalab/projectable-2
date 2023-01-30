import Store from "electron-store";

export class ProjectableStore<T> {
  private store: Store<{ value: T }>;
  private name: string;
  constructor(name: string, defaultState: T) {
    this.name = `pj2-${name}`;
    this.store = new Store({
      name: this.name,
      defaults: { value: defaultState },
    });
  }

  public get(): T {
    return this.store.get("value");
  }

  public set(state: T) {
    this.store.set("value", state);
  }

  public update(state: Partial<T>) {
    const currentState = this.get();
    const newState = { ...currentState, ...state };
    this.store.set("value", newState);
  }
}
