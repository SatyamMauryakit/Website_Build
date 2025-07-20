import { GenAiCode } from "@/configs/Aimodel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt, files } = await req.json();

  try {
    const result = await GenAiCode.sendMessage(prompt);
    const response = await result.response.text();

    return NextResponse.json(JSON.parse(response), { status: 200 });
  } catch (e) {
    const status = e.message?.includes("429") ? 429 : 500;
    return NextResponse.json(
      {
        error: e.message || e.toString(),
      },
      { status }
    );
  }
}
