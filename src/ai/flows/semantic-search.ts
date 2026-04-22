
/**
 * @fileOverview This file implements an AI-powered semantic search flow.
 * It takes a user query, generates an embedding for it, and then compares it
 * against a pre-generated set of content embeddings to find the most relevant
 * blog posts and knowledge base articles.
 *
 * - semanticSearch - A function that performs the semantic search.
 * - SemanticSearchInput - The input type for the semanticSearch function.
 * - SemanticSearchOutput - The return type for the semanticSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock pre-generated content embeddings. In a real application, this would be loaded from a JSON file.
// The `embedding` arrays are placeholders and would contain actual high-dimensional vectors (e.g., 768 for text-embedding-004).
interface ContentEmbedding {
  id: string;
  title: string;
  url: string;
  embedding: number[];
}

// Helper to create mock embeddings of a specific length
function createMockEmbedding(seed: number, length: number): number[] {
  return Array.from({ length }, (_, i) => Math.sin(seed + i * 0.1));
}

const embeddingDimension = 768; // Common dimension for text-embedding-004

const mockContentEmbeddings: ContentEmbedding[] = [
  {
    id: 'hexo-guide',
    title: 'Getting Started with Hexo: A Developer\'s Guide',
    url: '/blog/getting-started-hexo',
    embedding: createMockEmbedding(1, embeddingDimension),
  },
  {
    id: 'css-grid-layout',
    title: 'Understanding CSS Grid Layout',
    url: '/kb/css-grid-layout',
    embedding: createMockEmbedding(2, embeddingDimension),
  },
  {
    id: 'tailwind-tutorial',
    title: 'Tailwind CSS for Rapid UI Development',
    url: '/blog/tailwind-css-tutorial',
    embedding: createMockEmbedding(3, embeddingDimension),
  },
  {
    id: 'git-workflow',
    title: 'Efficient Git Workflow for Teams',
    url: '/kb/efficient-git-workflow',
    embedding: createMockEmbedding(4, embeddingDimension),
  },
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals: A Refresher',
    url: '/blog/javascript-fundamentals',
    embedding: createMockEmbedding(5, embeddingDimension),
  },
  {
    id: 'react-hooks',
    title: 'Mastering React Hooks for State Management',
    url: '/blog/react-hooks',
    embedding: createMockEmbedding(6, embeddingDimension),
  },
  {
    id: 'typescript-best-practices',
    title: 'TypeScript Best Practices for Large Scale Applications',
    url: '/kb/typescript-best-practices',
    embedding: createMockEmbedding(7, embeddingDimension),
  },
];


const SemanticSearchInputSchema = z.object({
  query: z.string().describe('The user\'s search query for blog posts or knowledge base articles.'),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

const SearchResultSchema = z.object({
  id: z.string().describe('The unique identifier of the content.'),
  title: z.string().describe('The title of the content.'),
  url: z.string().describe('The URL of the content.'),
  score: z.number().describe('The relevance score of the content to the query.'),
});
export type SearchResult = z.infer<typeof SearchResultSchema>;

const SemanticSearchOutputSchema = z.array(SearchResultSchema).describe('A list of semantically relevant search results.');
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

/**
 * Calculates the cosine similarity between two vectors.
 * @param vec1 The first vector.
 * @param vec2 The second vector.
 * @returns The cosine similarity score.
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must be of the same length');
  }
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0; // Avoid division by zero
  }
  return dotProduct / (magnitude1 * magnitude2);
}

// Define the Genkit flow for semantic search
const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async (input) => {
    // 1. Generate an embedding for the user's query
    const resp = await ai.generate({
      model: 'googleai/text-embedding-004', // Using the text embedding model
      prompt: input.query, // Direct string for embedding model prompt
    });
    const queryEmbedding = (resp as any).embedding as number[];

    if (!queryEmbedding || queryEmbedding.length === 0) {
      throw new Error('Failed to generate embedding for the query.');
    }

    // 2. Calculate similarity with pre-generated content embeddings
    const results: SearchResult[] = [];
    for (const content of mockContentEmbeddings) {
      if (content.embedding.length !== queryEmbedding.length) {
        console.warn(`Embedding length mismatch for content ID: ${content.id}. Skipping.`);
        continue;
      }
      const score = cosineSimilarity(queryEmbedding, content.embedding);
      results.push({
        id: content.id,
        title: content.title,
        url: content.url,
        score: score,
      });
    }

    // 3. Sort results by score in descending order and return top N (e.g., top 5)
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 5);
  }
);

export async function semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}
