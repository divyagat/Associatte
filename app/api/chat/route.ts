import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // You can integrate with:
    // - OpenAI API
    // - Groq (free)
    // - Google Gemini
    // - Your custom logic
    
    // Example: Simple response logic
    const getAIResponse = (msg: string) => {
      // Add your intelligent response logic here
      // Or call external AI API
      return `I received your question: "${msg}". Our team will get back to you shortly.`;
    };
    
    const response = getAIResponse(message);
    
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}