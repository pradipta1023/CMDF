class InMemoryVectorStore {
  #store;
  constructor (store = []) {
    this.#store = store;
  }

  add(vectors) {
    this.#store.push(...vectors);
  }

  
}