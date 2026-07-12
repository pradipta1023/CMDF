class EmbeddingPipeline {
  #embeddingService;
  constructor({ embeddingService }) {
    this.#embeddingService = embeddingService;
  }

  async embed(chunks) {
    if (!chunks)
      return Promise.reject(new Error("Chunks are required to embed"));

    if (!Array.isArray(chunks))
      return Promise.reject(new Error("Chunks must be an array."));

    if (chunks.length === 0)
      return Promise.resolve([]);

    return Promise.all(chunks.map(chunk => {
      const embeddingPromise = this.#embeddingService.embed(chunk.text);
      return embeddingPromise.then(embedding => ({ ...chunk, embedding }));
    }));
  }
}

export default EmbeddingPipeline;