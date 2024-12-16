import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getGeminiResponse } from '@/lib/gemini';

// Store chunks in memory (in a real app, you'd use a vector database)
let documentChunks: { text: string; metadata?: Record<string, any> }[] = [];

export const processDocumentForRAG = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.createDocuments([text]);
  documentChunks = chunks.map(chunk => ({
    text: chunk.pageContent,
    metadata: chunk.metadata,
  }));

  return `Document processed into ${documentChunks.length} chunks`;
};

export const searchRelevantChunks = (query: string): string[] => {
  // Simple keyword-based search (in a real app, you'd use embeddings and cosine similarity)
  const relevantChunks = documentChunks.filter(chunk => 
    chunk.text.toLowerCase().includes(query.toLowerCase())
  );

  return relevantChunks.map(chunk => chunk.text);
};

export const generateRAGResponse = async (query: string): Promise<string> => {
  const relevantChunks = searchRelevantChunks(query);
  
  if (relevantChunks.length === 0) {
    return "I couldn't find relevant information in the uploaded document to answer your question.";
  }

  const context = relevantChunks.join('\n\n');
  const prompt = `Based on the following context, please answer the question. If the answer cannot be found in the context, say so.

Context:
${context}

Question: ${query}`;

  return getGeminiResponse(prompt);
};