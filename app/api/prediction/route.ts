import * as tf from "@tensorflow/tfjs";
import { NextRequest, NextResponse } from "next/server";

const URL = "http://172.210.99.32:8501/v1/models/visualbacter:predict";

export async function POST(req: NextRequest) {
  const data = await req.json();

  let { tensor, shape } = data;

  tensor = tf.tensor(tensor, shape);

  const tensorGrayScale = tf.image.rgbToGrayscale(tensor);

  let tensorExpanded = tensorGrayScale.expandDims(0);

  if (tensorExpanded.shape[1] !== 150 || tensorExpanded.shape[2] !== 150) {
    tensorExpanded = tf.image.resizeBilinear(tensorExpanded, [150, 150]);
  }

  const array = await tensorExpanded.array();

  const body = {
    instances: array,
  };

  const predictionsRequest = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "X-Source": "web",
      "Content-Type": "application/json",
    },
  });

  const response = await predictionsRequest.json();

  const predictions = response.predictions[0];

  return NextResponse.json({ predictions });
}
