"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Copy, Edit, BookOpen, Save, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateOptimizedBlogArticle } from "./actions";
import { ImproveArticleSeoOutput } from "@/ai/flows/improve-article-seo";
import { Logo } from "@/components/logo";

const formSchema = z.object({
  topic: z.string().min(5, {
    message: "Topic must be at least 5 characters.",
  }),
});

export default function BlogSmithPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState<ImproveArticleSeoOutput | null>(null);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setArticle(null);
    setIsEditing(false);

    try {
      const result = await generateOptimizedBlogArticle(values.topic);
      setArticle(result);
      setContent(result.optimizedArticle);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Article content has been copied to your clipboard.",
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <div className="inline-block mb-4">
          <Logo />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          AI BlogSmith
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Enter a topic and let our AI craft a complete, SEO-optimized blog post for you.
        </p>
      </header>

      <main>
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Wand2 className="text-primary" />
              Content Generator
            </CardTitle>
            <CardDescription>
              What would you like to write about today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 'The Future of Renewable Energy'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Article"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        )}

        {article && !isLoading && (
          <Card className="shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-2xl md:text-3xl">
                {isEditing ? "Editing Article" : article.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <><BookOpen className="mr-2" /> Preview</>
                  ) : (
                    <><Edit className="mr-2" /> Edit</>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2" /> Copy
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Save className="mr-2" /> Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[500px] text-base"
                  aria-label="Article content editor"
                />
              ) : (
                <div
                  className="prose-styles"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </CardContent>
            <CardFooter>
                 <div className="w-full">
                    <h4 className="font-headline text-lg font-semibold mb-2">SEO Insights</h4>
                    <p className="text-sm text-muted-foreground mb-3">{article.metaDescription}</p>
                    <div className="flex flex-wrap gap-2">
                        {article.keywords.map(keyword => (
                            <span key={keyword} className="text-xs bg-secondary text-secondary-foreground py-1 px-2 rounded-full">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            </CardFooter>
          </Card>
        )}

        {!article && !isLoading && (
             <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
                <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground font-headline">Your generated article will appear here.</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Start by entering a topic above and clicking "Generate Article".
                </p>
            </div>
        )}
      </main>
      <footer className="text-center mt-12 py-4">
        <p className="text-sm text-muted-foreground">
          Powered by AI BlogSmith
        </p>
      </footer>
    </div>
  );
}
