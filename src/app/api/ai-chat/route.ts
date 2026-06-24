import { NextResponse } from 'next/server';
import { aiChatAssistant } from '@/ai/flows/ai-chat-assistant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body ?? {};

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const response = await aiChatAssistant({ message, history });
    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
