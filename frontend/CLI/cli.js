import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

class CLI {
  #rag;
  #rl;

  constructor({ ragApplication }) {
    this.#rag = ragApplication;

    this.#rl = createInterface({
      input: stdin,
      output: stdout,
    });
  }

  async start() {
    // console.clear();
    this.#printWelcome();

    while (true) {
      try {
        this.#printMenu();

        const choice = (await this.#rl.question("\nChoose an option: ")).trim();

        switch (choice) {
          case "1":
            await this.#addContext();
            break;

          case "2":
            await this.#askQuestion();
            break;

          case "3":
            console.log("\nGoodbye 👋");
            this.#rl.close();
            return;

          default:
            console.log("\n❌ Invalid option.");
        }
      } catch (error) {
        console.log(`\n❌ ${error.message}`);
      }
    }
  }

  async #addContext() {
    console.log("\nPaste your context below.");
    console.log("Press ENTER twice when finished.\n");

    const lines = [];

    while (true) {
      const line = await this.#rl.question("");

      if (!line.trim()) break;

      lines.push(line);
    }

    const context = lines.join("\n");

    await this.#rag.add(context);

    console.log("\n✅ Context added successfully.");
  }

  async #askQuestion() {
    const question = await this.#rl.question("\nQuestion: ");

    const { answer } = await this.#rag.ask(question);

    console.log("\n────────────────────────────────────────");
    console.log("Answer:\n");
    console.log(answer);
    console.log("────────────────────────────────────────");
  }

  #printWelcome() {
    console.log("========================================");
    console.log("        📚 Local RAG Assistant");
    console.log("========================================");
  }

  #printMenu() {
    console.log("\n1. Add Context");
    console.log("2. Ask Question");
    console.log("3. Exit");
  }
}

export default CLI;