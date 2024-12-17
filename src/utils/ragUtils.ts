import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getGeminiResponse } from '@/lib/gemini';

// Store chunks in memory (in a real app, you'd use a vector database)
let documentChunks: { text: string; metadata?: Record<string, any> }[] = [];

export const processDocumentForRAG = async (text: string) => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);
    documentChunks = chunks.map(chunk => ({
      text: chunk.pageContent,
      metadata: chunk.metadata,
    }));

    console.log(`Dokument przetworzony na ${documentChunks.length} fragmentów`);
    return `Dokument został przetworzony na ${documentChunks.length} fragmentów`;
  } catch (error) {
    console.error("Błąd podczas przetwarzania dokumentu:", error);
    throw new Error("Wystąpił błąd podczas przetwarzania dokumentu");
  }
};

export const searchRelevantChunks = (query: string): string[] => {
  if (documentChunks.length === 0) {
    console.log("Brak przetworzonych dokumentów w pamięci");
    return [];
  }

  // Simple keyword-based search (in a real app, you'd use embeddings and cosine similarity)
  const relevantChunks = documentChunks.filter(chunk => 
    chunk.text.toLowerCase().includes(query.toLowerCase())
  );

  console.log(`Znaleziono ${relevantChunks.length} pasujących fragmentów`);
  return relevantChunks.map(chunk => chunk.text);
};

export const generateRAGResponse = async (query: string): Promise<string> => {
  if (documentChunks.length === 0) {
    return "Nie wgrano jeszcze żadnego dokumentu. Proszę najpierw wgrać dokument, aby móc zadawać pytania.";
  }

  const relevantChunks = searchRelevantChunks(query);
  
  if (relevantChunks.length === 0) {
    return "Nie znalazłem odpowiednich informacji w wgranym dokumencie, które pomogłyby odpowiedzieć na to pytanie.";
  }

  const context = relevantChunks.join('\n\n');
  const prompt = `Na podstawie poniższego kontekstu, odpowiedz na pytanie. Jeśli odpowiedź nie znajduje się w kontekście, powiedz o tym.

Kontekst:
${context}

Pytanie: ${query}`;

  return getGeminiResponse(prompt);
};