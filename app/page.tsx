"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files && files.length > 0, "Please select a file.")
    .refine(
      (files) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(files[0]?.type),
      "Please upload a valid image file (jpeg, jpg, png)."
    ),
});

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { image } = values;

    if (image) {
      const file = image[0];
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      await fetch("/api/prediction", {
        method: "POST",
        body: file,
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      <section>
        <h1 className="text-5xl font-bold">VisualBacter</h1>
        <span>Detection of ETA's convolutional neural networks</span>
        <Badge variant="outline" className="mr-2">
          80.76% Accuracy
        </Badge>
        <br />
        <br />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="w-fit"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Only JPG, PNG images are allowed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="gap-2">Analyze <Sparkles height={16} width={16}/></Button>
          </form>
        </Form>
      </section>
      <section className="flex-1 flex items-center justify-center">
        {imageUrl && (
          <div className="mt-4">
            <Image
              src={imageUrl}
              alt="Selected image"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
        )}
      </section>
    </main>
  );
}
