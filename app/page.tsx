"use client";

import PredictionChart from "@/components/prediction-chart";
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
import { CLASSNAMES } from "@/config/constants";
import { PredictionsResponse } from "@/lib/types/predictions-response";
import { zodResolver } from "@hookform/resolvers/zod";
import * as tf from "@tensorflow/tfjs";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  image:
    typeof window === "undefined"
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((file) => file?.length == 1, "Image is required.")
          .refine((file) => {
            const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
            return file && allowedTypes.includes(file[0].type);
          }, "Only JPG, JPEG, PNG images are allowed."),
});

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionsResponse | null>(
    null
  );
  const [bacteria, setBacteria] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPredictions(null);
    setBacteria("");

    const { image } = values;

    if (image) {
      const file: File = image[0];

      const imageUrl = URL.createObjectURL(file);

      setImageUrl(imageUrl);

      const img = document.createElement("img");

      img.src = imageUrl;

      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img);

        const tensorData = tensor.dataSync();

        const body = {
          tensor: Array.from(tensorData),
          shape: tensor.shape,
        };

        const requestPredictions = await fetch("/api/prediction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const predictions: PredictionsResponse =
          await requestPredictions.json();

        setPredictions(predictions);

        const max = Math.max(...predictions.predictions);

        const maxIndex = predictions.predictions.indexOf(max);

        const bacteria = CLASSNAMES[maxIndex];

        setBacteria(bacteria);
      };
    }
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen p-4 lg:p-24">
      <section className="flex flex-col">
        <h1 className="text-5xl font-bold">VisualBacter</h1>
        <span>Detection of ETA's with convolutional neural networks</span>
        <Badge variant="outline" className="mr-2 w-fit">
          80.76% Accuracy
        </Badge>
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
                      className="w-fit"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Only JPG, JPEG, PNG images are allowed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="gap-2">
              Analyze <Sparkles height={16} width={16} />
            </Button>
          </form>
        </Form>
        <span className="text-sm my-3">
          Available classes: {CLASSNAMES.join(", ")}
        </span>
      </section>
      <section className="flex flex-col">
        {imageUrl && (
          <div className="mt-4">
            <section className="flex items-center mb-5">
              <Image
                src={imageUrl}
                alt="Selected image"
                width={250}
                height={250}
                className="rounded-lg w-1/2"
              />
              {bacteria && bacteria !== "" && (
                <span className="text-2xl text-center w-1/2 font-mono">
                  {bacteria}
                </span>
              )}
            </section>
            {predictions && <PredictionChart predictions={predictions} />}
          </div>
        )}
      </section>
    </main>
  );
}
