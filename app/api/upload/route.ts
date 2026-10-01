import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PDFParse } from "pdf-parse";

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
        {
          error: "Please select a PDF file."
        },
        { status: 400 }
      );
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        {
          error: "Only PDF files are supported."
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    if (buffer.length === 0) {
      return NextResponse.json(
        {
          error: "The uploaded PDF is empty."
        },
        { status: 400 }
      );
    }

    const parser = new PDFParse({
      data: buffer
    });

    const result = await parser.getText();

    await parser.destroy();

    const text = result.text?.trim() || "";

    if (!text) {
      return NextResponse.json(
        {
          error:
            "No readable text was found in this PDF. Please try a text-based PDF."
        },
        { status: 400 }
      );
    }

    const documentId = randomUUID();

    const pages = text
      .split(/\n\s*\n/)
      .filter(
        (page: string) =>
          page.trim().length > 0
      );

    globalStore.documents!.set(
      documentId,
      {
        text,
        pages
      }
    );

    return NextResponse.json({
      success: true,
      documentId,
      pages: result.total || pages.length,
      message: "PDF processed successfully."
    });

  } catch (error) {

    console.error(
      "PDF upload error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown PDF processing error.";

    return NextResponse.json(
      {
        error:
          "PDF processing failed: " +
          message
      },
      { status: 500 }
    );
  }
}
