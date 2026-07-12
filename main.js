import chunker from "./src/chunker.js";
import OllamaEmbeddingService from "./src/OllamaEmbeddingService.js";
import EmbeddingPipeline from "./src/EmbeddingPipeline.js";

const main = () => {
  const text = "This is a test string to test chunking functionality.";
  const options = { chunkSize: 3, overlap: 2 };

  const chunks = chunker(text, options);
  const embeddingService = new OllamaEmbeddingService({
    baseUrl: "http://localhost:11434",
    model: "nomic-embed-text",
  })
  const pipeline = new EmbeddingPipeline({ embeddingService });
  pipeline.embed(chunks).then((result) => {
    console.log("Chunks with embeddings:", result);
  }).catch((error) => {
    console.error("Error embedding chunks:", error);
  });
}

main();