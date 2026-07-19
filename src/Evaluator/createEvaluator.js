import chunker from "../chunker.js";
import OllamaEmbeddingService from "../EmbeddingService/OllamaEmbeddingService.js";
import EmbeddingPipeline from "../embeddingPipeline.js";
import InMemoryVectorStore from "../vector-store/InMemoryVectorStore.js";
import Retriever from "../Retriever/Retriever.js";
import PromptBuilder from "../PromptBuilder/PromptBuilder.js";
import OllamaChatService from "../ChatService/OllamaChatService.js";
import RagApplication from "../RagApplication/RagApplication.js";

import LLMJudgeComparator from "../Comparator/LLMJudgeComparator.js";
import Evaluator from "../Evaluator/Evaluator.js";

const createEvaluator = () => {
  const embeddingService = new OllamaEmbeddingService({
    baseUrl: "http://localhost:11434",
    model: "nomic-embed-text",
  });

  const embeddingPipeline = new EmbeddingPipeline({
    embeddingService,
  });

  const vectorStore = new InMemoryVectorStore();

  const retriever = new Retriever({
    embeddingService,
    vectorStore,
  });

  const promptBuilder = new PromptBuilder();

  const chatService = new OllamaChatService({
    baseUrl: "http://localhost:11434",
    model: "qwen3:14b",
  });

  const ragApplication = new RagApplication({
    chunker,
    embeddingPipeline,
    vectorStore,
    retriever,
    promptBuilder,
    chatService,
    chunkOptions: {
      chunkSize: 20,
      overlap: 8,
    }
  });

  const comparator = new LLMJudgeComparator({
    chatService,
  });

  const evaluator = new Evaluator({
    comparator,
    ragApplication,
  });

  return evaluator;
};

export default createEvaluator;