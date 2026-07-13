class RagApplication {
  #chunker;
  #embeddingPipeline;
  #vectorStore;
  #retriever;
  #promptBuilder;
  #chatService;

  constructor({ chunker,
    embeddingPipeline,
    vectorStore,
    retriever,
    promptBuilder,
    chatService }) {
    this.#chunker = chunker;
    this.#embeddingPipeline = embeddingPipeline;
    this.#vectorStore = vectorStore;
    this.#retriever = retriever;
    this.#promptBuilder = promptBuilder;
    this.#chatService = chatService;
  }

  async add(context, { chunkSize = 5, overlap = 2 } = {}) {
    const chunks = this.#chunker(context, { chunkSize, overlap });
    const embeddings = await this.#embeddingPipeline.embed(chunks);
    this.#vectorStore.add(embeddings);

    return embeddings.length;
  }

  async ask(question) {
    const chunks = await this.#retriever.retrieve(question);
    const prompt = this.#promptBuilder.build({ question, chunks });

    return await this.#chatService.generate({ prompt });
  }
}

export default RagApplication;