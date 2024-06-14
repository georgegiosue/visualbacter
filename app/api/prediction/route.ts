import { NextRequest, NextResponse } from "next/server";

const URL = process.env.INFERENCE_URL;

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { array } = data;

  const body = {
    instances: array,
  };

  const predictionsRequest = await fetch(URL!, {
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
