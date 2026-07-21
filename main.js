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
  const embeddingService = new OllamaEmbeddingService({ baseUrl: "http://localhost:11434", model: "nomic-embed-text", })
  const chatService = new OllamaChatService({ baseUrl: "http://localhost:11434", model: "qwen3:14b" })
  const vectorStore = new InMemoryVectorStore([]);
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