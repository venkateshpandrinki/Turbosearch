import {google} from '@ai-sdk/google';

import { streamText,convertToCoreMessages } from 'ai';


export const maxDuration =30;
export async function POST(req:Request) {
    const {messages} = await req.json();

    const result = await streamText({
        model:google('gemini-1.5-pro-latest'),
        messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
}