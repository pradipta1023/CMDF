import InMemoryVectorStore from "./src/vector-store/InMemoryVectorStore.js"
import chunker from "./src/chunker.js";
import OllamaEmbeddingService from "./src/EmbeddingService/OllamaEmbeddingService.js";
import EmbeddingPipeline from "./src/EmbeddingPipeline.js";

const main = async () => {
  const text = "React is a javascript library. React consists of hooks like useState, useEffect, useRef. The cat is eating fish.";
  const options = { chunkSize: 5, overlap: 2 };

  const chunks = chunker(text, options);
  const embeddingService = new OllamaEmbeddingService({
    baseUrl: "http://localhost:11434",
    model: "nomic-embed-text",
  })
  const vectorStore = new InMemoryVectorStore();


  const pipeline = new EmbeddingPipeline({ embeddingService });

  const result = await pipeline.embed(chunks)

  vectorStore.add(result);

  const question = "What is React?";
  const questionEmbedding = await embeddingService.embed(question);
  const context = vectorStore.search({ embedding: questionEmbedding, topK: 3 });

}

main();