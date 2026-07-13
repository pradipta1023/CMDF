class OllamaEmbeddingService {
  #model;
  #baseUrl;
  #request;

  constructor({ model, baseUrl, request = fetch }) {
    this.#model = model;
    this.#baseUrl = baseUrl;
    this.#request = request;
  }

  async embed(text) {
    if (!text) throw new Error("Input text must be a non-empty string.");
    try {
      const response = await this.#request(`${this.#baseUrl}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ model: this.#model, input: text, })
      });

      if (!response.ok) {
        throw new Error(`Ollama server returned status ${response.status}`);
      }

      const data = await response.json();
      return data.embeddings[0];
    } catch (error) {
      throw new Error(`Failed to generate embedding: Unable to connect to Ollama server. ${error.message}`);
    }
  }
}

export default OllamaEmbeddingService;