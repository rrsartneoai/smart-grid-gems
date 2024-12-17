import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getGeminiResponse } from '@/lib/gemini';

// Store chunks in memory (in a real app, you'd use a vector database)
let documentChunks: { text: string; metadata?: Record<string, any> }[] = [];

export const processDocumentForRAG = async (text: string) => {
  try {
    console.log('Rozpoczynam przetwarzanie dokumentu dla RAG, długość tekstu:', text.length);
    console.log('Przykład tekstu:', text.substring(0, 200) + '...');

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
    console.log('Przykładowy fragment:', documentChunks[0]?.text.substring(0, 100) + '...');
    return `Dokument został przetworzony na ${documentChunks.length} fragmentów`;
  } catch (error) {
    console.error("Błąd podczas przetwarzania dokumentu:", error);
    throw new Error("Wystąpił błąd podczas przetwarzania dokumentu");
  }
};

export const searchRelevantChunks = (query: string): string[] => {
  console.log('Szukam fragmentów dla zapytania:', query);
  console.log('Liczba dostępnych fragmentów:', documentChunks.length);

  if (documentChunks.length === 0) {
    console.log("Brak przetworzonych dokumentów w pamięci");
    return [];
  }

  // Simple keyword-based search (in a real app, you'd use embeddings and cosine similarity)
  const relevantChunks = documentChunks.filter(chunk => 
    chunk.text.toLowerCase().includes(query.toLowerCase())
  );

  console.log(`Znaleziono ${relevantChunks.length} pasujących fragmentów`);
  if (relevantChunks.length > 0) {
    console.log('Przykładowy znaleziony fragment:', relevantChunks[0].text.substring(0, 100) + '...');
  }
  return relevantChunks.map(chunk => chunk.text);
};

export const generateRAGResponse = async (query: string): Promise<string> => {
  console.log('Generuję odpowiedź dla zapytania:', query);

  if (documentChunks.length === 0) {
    console.log('Brak dokumentów w pamięci');
    return "Nie wgrano jeszcze żadnego dokumentu. Proszę najpierw wgrać dokument, aby móc zadawać pytania.";
  }

  const relevantChunks = searchRelevantChunks(query);
  
  if (relevantChunks.length === 0) {
    console.log('Nie znaleziono pasujących fragmentów');
    return "Nie znalazłem odpowiednich informacji w wgranym dokumencie, które pomogłyby odpowiedzieć na to pytanie.";
  }

  const context = relevantChunks.join('\n\n');
  const prompt = `Na podstawie poniższego kontekstu, odpowiedz na pytanie. Jeśli odpowiedź nie znajduje się w kontekście, powiedz o tym.

Kontekst:
${context}

Pytanie: ${query}`;

  console.log('Wysyłam zapytanie do Gemini z kontekstem długości:', context.length);
  return getGeminiResponse(prompt);
};