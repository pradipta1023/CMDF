import chunker from '../src/chunker.js';

describe('chunker', () => {
  test('Should throw an error if text is not provided', () => {
    expect(() => chunker()).toThrow('Text is required for chunking.');
  });

  test("Should return chunks of the specified size with the specified overlap", () => {
    const text = "This is a test string to test chunking functionality.";
    const options = { chunkSize: 3, overlap: 2 };

    const expectedChunks = [
      { id: 1, text: "This is a" },
      { id: 2, text: "is a test" },
      { id: 3, text: "a test string" },
      { id: 4, text: "test string to" },
      { id: 5, text: "string to test" },
      { id: 6, text: "to test chunking" },
      { id: 7, text: "test chunking functionality." },
    ];

    expect(chunker(text, options)).toEqual(expectedChunks);
  });

  test("Should return chunks of the default size (5) with the default overlap (2) when no options are provided", () => {
    const text = "This is a test string to test chunking functionality.";

    const expectedChunks = [
      { id: 1, text: "This is a test string" },
      { id: 2, text: "test string to test chunking" },
      { id: 3, text: "test chunking functionality." }
    ];

    expect(chunker(text)).toEqual(expectedChunks);
  });

  test("Should handle cases where the text is shorter than the chunk size", () => {
    const text = "Short text";
    const options = { chunkSize: 5, overlap: 2 };

    const expectedChunks = [
      { id: 1, text: "Short text" }
    ];

    expect(chunker(text, options)).toEqual(expectedChunks);
  });

  test("Should handle cases where the text is exactly the chunk size", () => {
    const text = "This is a test string";
    const options = { chunkSize: 5, overlap: 2 };

    const expectedChunks = [
      { id: 1, text: "This is a test string" },
    ];

    expect(chunker(text, options)).toEqual(expectedChunks);
  });

  test("Should throw an error if chunkSize is 0", () => {
    expect(() => chunker("Some text", { chunkSize: 0, overlap: 2 })).toThrow();
  });

  test("Should throw an error if overlap is negative", () => {
    expect(() => chunker("Some text", { chunkSize: 5, overlap: -1 })).toThrow();
  });

  test("Should handle cases where overlap is greater than or equal to chunkSize", () => {
    expect(() => chunker("Some text", { chunkSize: 5, overlap: 5 })).toThrow();
  });

  test("Returns the partial chunk when the last chunk is smaller than the specified chunk size", () => {
    const text = "A B C D E F G";
    const options = { chunkSize: 5, overlap: 2 };

    const expectedChunks = [
      { id: 1, text: "A B C D E" },
      { id: 2, text: "D E F G" }
    ];
    expect(chunker(text, options)).toEqual(expectedChunks);
  });

  test("Should assign sequential IDs to each chunk", () => {
    const text = "This is a test string to test chunking functionality.";
    const options = { chunkSize: 3, overlap: 2 };

    const chunks = chunker(text, options);
    const ids = chunks.map(chunk => chunk.id);

    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});