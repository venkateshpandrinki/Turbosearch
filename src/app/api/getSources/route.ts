import { NextResponse } from "next/server";
import {z} from 'zod'


export async function POST(request:Request){
    const {question} = await request.json();
       const SERPER_API_KEY = process.env.SERPER_API_KEY;
       if (!SERPER_API_KEY) {
         throw new Error("SERPER_API_KEY is not defined");
       }
    
       const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: question,
          num: 6,
        }),
      });

      const rawJSON = await response.json();
      const SerperJSONSchema = z.object({
        organic: z.array(z.object({ title: z.string(), link: z.string() })),
      });
  
      const data = SerperJSONSchema.parse(rawJSON);
  
      const results = data.organic.map((result) => ({
        name: result.title,
        url: result.link,
      }));

      return NextResponse.json(results);
}