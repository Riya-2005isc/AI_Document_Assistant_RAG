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

    // Check whether a file was uploaded
    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload a PDF file.",
        },
        { status: 400 }
      );
    }

    // Check file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Only PDF files are supported.",
        },
        { status: 400 }
      );
    }

    // Convert uploaded PDF to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse PDF using the current pdf-parse API
    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    // Release parser resources
    await parser.destroy();

    // Check whether readable text exists
    if (!result.text || !result.text.trim()) {
      return NextResponse.json(
        {
          error:
            "No readable text was found. This may be a scanned or image-only PDF.",
        },
        { status: 400 }
      );
    }

    // Create a unique document ID
    const documentId = randomUUID();

    // Split extracted text into smaller sections
    const pages = result.text
      .split(/\n\s*\n/)
      .filter((page: string) => page.trim().length > 0);

    // Store document temporarily
    globalStore.documents!.set(documentId, {
      text: result.text,
      pages,
    });

    return NextResponse.json({
      success: true,
      documentId,
      pages: result.total,
      message: "PDF processed successfully.",
    });
  } catch (error) {
    console.error("PDF processing error:", error);

    return NextResponse.json(
      {
        error: "Unable to process the PDF.",
      },
      { status: 500 }
    );
  }
}
