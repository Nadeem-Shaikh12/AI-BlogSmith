'use server';

/**
 * @fileOverview A blog article generation AI agent.
 *
 * - generateBlogArticle - A function that handles the blog article generation process.
 * - GenerateBlogArticleInput - The input type for the generateBlogArticle function.
 * - GenerateBlogArticleOutput - The return type for the generateBlogArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogArticleInputSchema = z.object({
  topic: z.string().describe('The topic or idea for the blog article.'),
});
export type GenerateBlogArticleInput = z.infer<typeof GenerateBlogArticleInputSchema>;

const GenerateBlogArticleOutputSchema = z.object({
  title: z.string().describe('The title of the blog article.'),
  introduction: z.string().describe('The introduction of the blog article.'),
  body: z.string().describe('The body paragraphs of the blog article.'),
  conclusion: z.string().describe('The conclusion of the blog article.'),
  fullArticle: z.string().describe('The full generated blog article, including title, introduction, body, and conclusion.'),
});
export type GenerateBlogArticleOutput = z.infer<typeof GenerateBlogArticleOutputSchema>;

export async function generateBlogArticle(input: GenerateBlogArticleInput): Promise<GenerateBlogArticleOutput> {
  return generateBlogArticleFlow(input);
}

const generateBlogArticlePrompt = ai.definePrompt({
  name: 'generateBlogArticlePrompt',
  input: {schema: GenerateBlogArticleInputSchema},
  output: {schema: GenerateBlogArticleOutputSchema},
  prompt: `You are an expert blog writer and content creator. Based on the given topic, generate a full-length, well-structured blog article, including a title, introduction, body paragraphs, and conclusion.\n\nTopic: {{{topic}}}`,
});

const generateBlogArticleFlow = ai.defineFlow(
  {
    name: 'generateBlogArticleFlow',
    inputSchema: GenerateBlogArticleInputSchema,
    outputSchema: GenerateBlogArticleOutputSchema,
  },
  async input => {
    const {output} = await generateBlogArticlePrompt(input);

    // Combine all parts into a full article
    const fullArticle = `<h1>${output!.title}</h1>\n<p>${output!.introduction}</p>\n<p>${output!.body}</p>\n<p>${output!.conclusion}</p>`;

    return {
      ...output!,
      fullArticle,
    };
  }
);
