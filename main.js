import { ChromaClient } from "chromadb";
import ChromaVectorStore from "./src/vector-store/chormaVectorStore.js";
import InMemoryVectorStore from "./src/vector-store/InMemoryVectorStore.js"
import chunker from "./src/chunker.js";
import OllamaEmbeddingService from "./src/EmbeddingService/OllamaEmbeddingService.js";
import EmbeddingPipeline from "./src/EmbeddingPipeline.js";
import OllamaChatService from "./src/ChatService/OllamaChatService.js"
import Retriever from "./src/Retriever/Retriever.js"
import PromptBuilder from "./src/PromptBuilder/PromptBuilder.js"
import RagApplication from "./src/RagApplication/RagApplication.js"
import CLI from "./frontend/CLI/cli.js"

const main = async () => {
  const embeddingService = new OllamaEmbeddingService({ baseUrl: "http://localhost:11435", model: "nomic-embed-text", })
  const chatService = new OllamaChatService({ baseUrl: "http://localhost:11435", model: "qwen3:14b" })

  const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false
  })
  const collection = await client.getOrCreateCollection({ name: "test", embeddingFunction: null })

  const vectorStore = new ChromaVectorStore({ collection });

  const embeddingPipeline = new EmbeddingPipeline({ embeddingService });
  const retriever = new Retriever({ embeddingService, vectorStore })
  const promptBuilder = new PromptBuilder();

  const ragApplication = new RagApplication({
    chunker,
    embeddingPipeline,
    vectorStore,
    retriever,
    promptBuilder,
    chatService,
    chunkOptions: {
      chunkSize: 10,
      overlap: 5,
    }
  });

  const cli = new CLI({ ragApplication });

  await cli.start();
}

main();