import { chatSession } from "@/configs/Aimodel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await chatSession.sendMessage(prompt);
    const AIresp = await result.response.text();
    return NextResponse.json({ result: AIresp }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || e.toString() },
      { status: 500 }
    );
  }
}
