// app/api/remove-watermark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'edge';
export const maxDuration = 60;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || 'r8_your_key',
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: '請上傳圖片' },
        { status: 400 }
      );
    }

    // 轉換為 base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

    // 使用 Flux Fill 進行 inpainting
    const output = await replicate.run(
      "black-forest-labs/flux-fill-pro",
      {
        input: {
          image: base64Image,
          prompt: "remove watermark, clean background, seamless inpainting",
          guidance: 3.5,
          num_outputs: 1,
          output_format: "png",
          output_quality: 100,
        }
      }
    );

    return NextResponse.json({ 
      success: true,
      result: output 
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || '處理失敗' },
      { status: 500 }
    );
  }
}
