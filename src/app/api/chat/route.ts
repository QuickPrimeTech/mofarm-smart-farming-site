import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY, 
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // FIX: Clean the messages to strictly match the expected CoreMessage schema
  const cleanMessages = messages.map((msg: any) => {
    // Extract text whether it comes as a standard string or a modern 'parts' array
    let textContent = msg.content;
    if (!textContent && msg.parts) {
      textContent = msg.parts.map((part: any) => part.text).join('\n');
    }

    return {
      role: msg.role,
      content: textContent || "",
    };
  });

  const result = streamText({
    model: groq('groq/compound-mini'), // Ensure this model ID exactly matches Groq's dashboard
    system: `You are MoFarm Assistant, a helpful AI for a fresh farm produce platform. 
             Help users with questions about farm produce, prices, availability, 
             farming tips, and anything agriculture-related. Be friendly and concise.`,
    messages: cleanMessages,
    onFinish: ({ text }) => {
      console.log('--- AI RESPONSE TO USER ---');
      console.log(text);
      console.log('---------------------------');
    }, 
  });

  return result.toTextStreamResponse();
}