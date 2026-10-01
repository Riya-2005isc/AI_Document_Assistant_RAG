import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import pdf from "pdf-parse";

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
        { error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await pdf(buffer);

    if (!data.text.trim()) {
      return NextResponse.json(
        {
          error:
            "No readable text was found. This may be a scanned/image-only PDF."
        },
        { status: 400 }
      );
    }

    const documentId = randomUUID();

    const pages = data.text
      .split("\n\n")
      .filter((page: string) => page.trim().length > 0);

    globalStore.documents!.set(documentId, {
      text: data.text,
      pages
    });

    return NextResponse.json({
      success: true,
      documentId,
      pages: data.numpages,
      message: "PDF processed successfully."
    });
  } catch (error) {
    console.error("PDF processing error:", error);

    return NextResponse.json(
      {
        error: "Unable to process the PDF."
      },
      { status: 500 }
    );
  }
}
