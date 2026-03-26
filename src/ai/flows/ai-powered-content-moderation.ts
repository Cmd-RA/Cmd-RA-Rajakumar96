'use server';
/**
 * @fileOverview This flow provides an AI-powered content moderation tool.
 *
 * - moderateContent - A function that detects and flags inappropriate content in user-uploaded posts.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user's post content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  title: z.string().describe('The title of the user-uploaded post.'),
  description: z
    .string()
    .describe('The description or body text of the user-uploaded post.'),
});
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe(
      'True if the content (image and text) is deemed appropriate for the platform, false otherwise.'
    ),
  reason: z
    .string()
    .describe(
      'If the content is not appropriate, a concise reason explaining why, otherwise an empty string.'
    ),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(
  input: ModerateContentInput
): Promise<ModerateContentOutput> {
  return moderateContentFlow(input);
}

const moderateContentPrompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  config: {
    safetySettings: [
      {category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE'},
    ],
  },
  prompt: `You are an AI-powered content moderation system for a social media platform. Your task is to analyze user-uploaded posts, including both an image and accompanying text, to determine if the content is appropriate for the platform.

Consider the following categories for inappropriate content:
- Hate Speech: Any content that promotes hatred against a group based on attributes like race, ethnicity, religion, gender, sexual orientation, disability, or nationality.
- Sexually Explicit Content: Nudity, sexual acts, or content intended to arouse sexually.
- Harassment: Content that is abusive, threatening, or intended to harass an individual or group.
- Violence/Dangerous Content: Content that glorifies violence, incites violence, depicts graphic violence, or promotes dangerous activities.
- Illegal Activities: Content related to illegal drugs, weapons, or other unlawful acts.

Evaluate the image and text provided. If any part of the content falls into one of these inappropriate categories, mark 'isAppropriate' as 'false' and provide a concise 'reason' explaining which category is violated and why. If the content is entirely appropriate, mark 'isAppropriate' as 'true' and the 'reason' as an empty string.

Image: {{media url=photoDataUri}}
Title: {{{title}}}
Description: {{{description}}}`,
});

const moderateContentFlow = ai.defineFlow(
  {
    name: 'moderateContentFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async input => {
    const {output} = await moderateContentPrompt(input);
    return output!;
  }
);
