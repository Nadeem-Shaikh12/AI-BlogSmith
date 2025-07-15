// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Enhances a blog article's SEO by suggesting relevant keywords and optimizing the content for search engines.
 *
 * - improveArticleSeo - A function that handles the SEO improvement process.
 * - ImproveArticleSeoInput - The input type for the improveArticleSeo function.
 * - ImproveArticleSeoOutput - The return type for the improveArticleSeo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveArticleSeoInputSchema = z.object({
  article: z.string().describe('The blog article to optimize for SEO.'),
  topic: z.string().describe('The topic of the blog article.'),
});
export type ImproveArticleSeoInput = z.infer<typeof ImproveArticleSeoInputSchema>;

const ImproveArticleSeoOutputSchema = z.object({
  title: z.string().describe('The optimized title of the blog article.'),
  keywords: z.array(z.string()).describe('Relevant keywords for the blog article.'),
  metaDescription: z.string().describe('The optimized meta description for the blog article.'),
  optimizedArticle: z.string().describe('The SEO-optimized blog article.'),
});
export type ImproveArticleSeoOutput = z.infer<typeof ImproveArticleSeoOutputSchema>;

export async function improveArticleSeo(input: ImproveArticleSeoInput): Promise<ImproveArticleSeoOutput> {
  return improveArticleSeoFlow(input);
}

const improveArticleSeoPrompt = ai.definePrompt({
  name: 'improveArticleSeoPrompt',
  input: {schema: ImproveArticleSeoInputSchema},
  output: {schema: ImproveArticleSeoOutputSchema},
  prompt: `You are an SEO expert. You will be provided with a blog article and its topic. Your goal is to optimize the article for search engines.

  Specifically, you will:
  1. Suggest a new title that is more SEO-friendly.
  2. Suggest a list of relevant keywords.
  3. Write an optimized meta description.
  4. Rewrite the article to include the keywords naturally and improve its overall SEO.

  Here is the blog article:
  {{{article}}}

  Here is the topic of the blog article:
  {{{topic}}}
  `,
});

const improveArticleSeoFlow = ai.defineFlow(
  {
    name: 'improveArticleSeoFlow',
    inputSchema: ImproveArticleSeoInputSchema,
    outputSchema: ImproveArticleSeoOutputSchema,
  },
  async input => {
    const {output} = await improveArticleSeoPrompt(input);
    return output!;
  }
);
