import { NextResponse } from "next/server";

export const runtime = "nodejs";

type DocumentStore = {
  text: string;
  pages: string[];
};

const globalStore = globalThis as unknown as {
  documents?: Map<string, DocumentStore>;
};

function splitText(text: string, size = 1500) {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
}

function findRelevantChunks(text: string, question: string) {
  const chunks = splitText(text);

  const keywords = question
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const scored = chunks.map((chunk) => {
    const lowerChunk = chunk.toLowerCase();

    let score = 0;

    for (const keyword of keywords) {
      if (lowerChunk.includes(keyword)) {
        score++;
      }
    }

    return {
      chunk,
      score
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.chunk);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const question = body.question?.trim();
    const documentId = body.documentId;

    if (!question) {
      return NextResponse.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    if (!documentId) {
      return NextResponse.json(
        { error: "No document selected." },
        { status: 400 }
      );
    }

    const documents = globalStore.documents;

    if (!documents) {
      return NextResponse.json(
        { error: "Document storage is unavailable." },
        { status: 500 }
      );
    }

    const document = documents.get(documentId);

    if (!document) {
      return NextResponse.json(
        {
          error:
            "Document not found. Please upload the PDF again."
        },
        { status: 404 }
      );
    }

    const relevantChunks = findRelevantChunks(
      document.text,
      question
    );

    const context = relevantChunks.join("\n\n");

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GROQ_API_KEY is not configured in Vercel."
        },
        { status: 500 }
      );
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: `
You are an AI Document Assistant.

Answer the user's question using ONLY the provided document context.

Rules:
- Do not invent information.
- If the answer is not present in the context, clearly say that the information could not be found in the document.
- Give clear and concise answers.
- Use bullet points when useful.

DOCUMENT CONTEXT:
${context}
              `
            },
            {
              role: "user",
              content: question
            }
          ]
        })
      }
    );

    const result = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq error:", result);

      return NextResponse.json(
        {
          error:
            result?.error?.message ||
            "Groq API request failed."
        },
        { status: 500 }
      );
    }

    const answer =
      result?.choices?.[0]?.message?.content ||
      "I could not generate an answer.";

    return NextResponse.json({
      answer,
      sources: ["Uploaded PDF"]
    });
  } catch (error) {
    console.error("Chat error:", error);

    return NextResponse.json(
      {
        error: "Unable to process your question."
      },
      { status: 500 }
    );
  }
}
