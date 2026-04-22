/**
 * @fileOverview A Genkit flow for a floating AI assistant chat UI with history support.
 *
 * - aiChatAssistant - A function that handles interactions with the AI chat assistant.
 * - AIChatAssistantInput - The input type for the aiChatAssistant function.
 * - AIChatAssistantOutput - The return type for the aiChatAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const AIChatAssistantInputSchema = z.object({
  message: z.string().describe("The user's latest message."),
  history: z.array(MessageSchema).optional().describe("The previous conversation history."),
});
export type AIChatAssistantInput = z.infer<typeof AIChatAssistantInputSchema>;

const AIChatAssistantOutputSchema = z.string().describe('The AI chat assistant\'s response.');
export type AIChatAssistantOutput = z.infer<typeof AIChatAssistantOutputSchema>;

export async function aiChatAssistant(
  input: AIChatAssistantInput
): Promise<AIChatAssistantOutput> {
  return aiChatAssistantFlow(input);
}

const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistantFlow',
    inputSchema: AIChatAssistantInputSchema,
    outputSchema: AIChatAssistantOutputSchema,
  },
  async (input) => {
    const { message, history = [] } = input;

    const response = await ai.generate({
      system: `You are Pixel, the high-performance AI assistant for PixelNest.
Your tone is futuristic, professional, and helpful. 
You answer questions about web development, product design, and the portfolio's contents.
Keep your answers concise and formatted with markdown if necessary.
Current date: ${new Date().toLocaleDateString()}`,
      messages: [
        ...history.map(h => ({
          role: h.role as any,
          content: [{ text: h.content }]
        })),
        { role: 'user', content: [{ text: message }] }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  }
);
