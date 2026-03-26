'use server';
/**
 * @fileOverview A Genkit flow for generating creative and engaging titles and descriptions for photo posts.
 *
 * - suggestPhotoContent - A function that suggests titles and descriptions for a photo.
 * - SuggestPhotoContentInput - The input type for the suggestPhotoContent function.
 * - SuggestPhotoContentOutput - The return type for the suggestPhotoContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestPhotoContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the post content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userPrompt: z
    .string()
    .optional()
    .describe(
      'An optional user prompt to guide the AI in generating the title and description.'
    ),
});
export type SuggestPhotoContentInput = z.infer<
  typeof SuggestPhotoContentInputSchema
>;

const SuggestPhotoContentOutputSchema = z.object({
  suggestedTitle: z.string().describe('A creative and engaging title for the photo post.'),
  suggestedDescription: z.string().describe('A compelling description for the photo post.'),
});
export type SuggestPhotoContentOutput = z.infer<
  typeof SuggestPhotoContentOutputSchema
>;

export async function suggestPhotoContent(
  input: SuggestPhotoContentInput
): Promise<SuggestPhotoContentOutput> {
  return suggestPhotoContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPhotoContentPrompt',
  input: { schema: SuggestPhotoContentInputSchema },
  output: { schema: SuggestPhotoContentOutputSchema },
  prompt: `You are an AI assistant specialized in generating creative and engaging titles and descriptions for social media photo posts.

Based on the provided photo and any additional user prompt, suggest a compelling title and a detailed description that will attract engagement.

Consider the visual elements of the photo and the context provided by the user prompt.

Photo: {{media url=photoDataUri}}
{{#if userPrompt}}
User's guidance: {{{userPrompt}}}
{{/if}}

Generate a creative title and an engaging description.`,
});

const suggestPhotoContentFlow = ai.defineFlow(
  {
    name: 'suggestPhotoContentFlow',
    inputSchema: SuggestPhotoContentInputSchema,
    outputSchema: SuggestPhotoContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
