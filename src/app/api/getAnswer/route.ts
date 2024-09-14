import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 45;

export async function POST(request: Request) {
  let { question, sources } = await request.json();

  console.log("fetching the urls");
  let finalResults = await Promise.all(
    sources.map(async (result: any) => {
      try {
        const response = await fetchWithTimeout(result.url);
        const html = await response.text();
        const virtualConsole = new jsdom.VirtualConsole();
        const dom = new JSDOM(html, { virtualConsole });

        const doc = dom.window.document;
        const parsed = new Readability(doc).parse();
        let parsedContent = parsed
          ? cleanedText(parsed.textContent)
          : "Nothing found";
       
        return {
          ...result,
          fullContent: parsedContent,
        };
      } catch (e) {
        console.log(`error parsing ${result.name}, error:${e}`);
        return {
          ...result,
          fullContent: "not available",
        };
      }
    })
  );

  //promt
  const mainAnswerPrompt = `
  Given a user question and some context, please write a clean, concise and accurate answer to the question based on the context. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context when crafting your answer.

  Your answer must be correct, accurate and written by an expert using an unbiased and professional tone. Please limit to 1024 tokens. Do not give any information that is not related to the question, and do not repeat. Say "information is missing on" followed by the related topic, if the given context do not provide sufficient information. or give your best answer.

  Here are the set of contexts:

  <contexts>
  ${finalResults.map(
    (result, index) => `[[citation:${index}]] ${result.fullContent} \n\n`,
  )}
  </contexts>

  Remember, don't blindly repeat the contexts verbatim and don't tell the user how you used the citations – just respond with the answer. It is very important for my career that you follow these instructions. Here is the user question:
    `;
  //generating the answer
    try{
      const genAI = new GoogleGenerativeAI( process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContentStream({
        contents: [
          {
            role: "model",
            parts: [
              {
                text: mainAnswerPrompt,
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


      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
          controller.close();
        },
      });
  
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });

    }
    catch(e){
        console.log('Error streaming the answer',e);
    }


}

const cleanedText = (text: string) => {
  let newText = text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");

  return newText.substring(0, 20000);
};

async function fetchWithTimeout(url: string, options = {}, timeout = 3000) {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  return fetch(url, { ...options, signal })
    .then((response) => {
      clearTimeout(fetchTimeout);
      return response;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        throw new Error("Fetch request timed out");
      }
      throw error;
    });
}
