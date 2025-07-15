'use server';

import { generateBlogArticle } from '@/ai/flows/generate-blog-article';
import { improveArticleSeo, ImproveArticleSeoOutput } from '@/ai/flows/improve-article-seo';

export async function generateOptimizedBlogArticle(
  topic: string
): Promise<ImproveArticleSeoOutput> {
  if (!topic || topic.length < 5) {
    throw new Error('Topic must be at least 5 characters.');
  }

  try {
    const initialArticle = await generateBlogArticle({ topic });
    if (!initialArticle || !initialArticle.fullArticle) {
      throw new Error('Failed to generate initial article content.');
    }
    
    const optimizedArticle = await improveArticleSeo({
      article: initialArticle.fullArticle,
      topic: topic,
    });

    if (!optimizedArticle || !optimizedArticle.optimizedArticle) {
        throw new Error('Failed to optimize the article for SEO.');
    }

    return optimizedArticle;
  } catch (e) {
    console.error(e);
    // Re-throw a more user-friendly error
    throw new Error('An error occurred while generating the article. Please try again later.');
  }
}
