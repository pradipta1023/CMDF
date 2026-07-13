class Retriever {
  #embeddingService;
  #vectorStore;
  #constructor({ embeddingService, vectorStore }) {
    this.#embeddingService = embeddingService;
    this.#vectorStore = vectorStore;
  }

  async retrieve(question, { topK = 5 }) {
    const queryEmbedding = await this.#embeddingService.embed(question);
    
    return this.#vectorStore.search(queryEmbedding, { topK });
  }
}