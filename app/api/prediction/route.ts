import { NextRequest, NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs';

export async function POST(req: NextRequest) {
  
  
  return NextResponse.json({ message: "Hello Tensor!" });
}
