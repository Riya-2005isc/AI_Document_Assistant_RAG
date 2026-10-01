import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { extractText } from "unpdf";

export const runtime = "nodejs";

type DocumentStore = {
  text: string;
  pages: string[];
};

const globalStore = globalThis as unknown as {
  documents?: Map<string, DocumentStore>;
};

if (!globalStore.documents) {
  globalStore.documents = new Map<string, DocumentStore>();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a PDF file." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    if (buffer.byteLength === 0) {
      return NextResponse.json(
        { error: "The uploaded PDF is empty." },
        { status: 400 }
      );
    }

    const { text, totalPages } = await extractText(
      new Uint8Array(buffer),
      {
        mergePages: true,
      }
    );

    const documentText = text.trim();

    if (!documentText) {
      return NextResponse.json(
        {
          error:
            "No readable text was found. Please upload a text-based PDF."
        },
        { status: 400 }
      );
    }

    const documentId = randomUUID();

    const pages = documentText
      .split(/\n\s*\n/)
      .filter((page) => page.trim().length > 0);

    globalStore.documents!.set(documentId, {
      text: documentText,
      pages,
    });

    return NextResponse.json({
      success: true,
      documentId,
      pages: totalPages,
      message: "PDF processed successfully.",
    });
  } catch (error) {
    console.error("PDF upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process the PDF.",
      },
      { status: 500 }
    );
  }
}

