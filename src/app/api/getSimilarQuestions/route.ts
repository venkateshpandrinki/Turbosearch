import { GoogleGenerativeAI } from "@google/generative-ai";

import { SchemaType } from '@google/generative-ai';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let { question } = await request.json();

  const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY!
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
        },
      },
    },
  });

  const similarQuestions = await model.generateContent({
    contents: [
      {
        role: "model",
        parts: [
          {
            text: `
                                you are helpful assistant that helps the user to ask related questions, based on user's original question. please identify worthwhile topics that can be follow-ups, and write 3 questions no longer than 20 words each. please make sure that specifics, like events, names, locations, are included in follow up questions so they can be asked standalone. For example, if the original question asks about "the Manhattan project", in the follow up question, do not just say "the project", but use the full name "the Manhattan project". Your related questions must be in the same language as the original question. Please provide these 3 related questions as a JSON array of 3 strings. Do NOT repeat the original question. ONLY return the JSON array, I will get fired if you don't return JSON. Here is the user's original question:
                        `,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: question,
          },
        ],
      },
    ],
  });
  
  let sq = similarQuestions.response.text();
return NextResponse.json(JSON.parse(sq));
}
