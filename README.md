# AI Document Assistant using RAG

An AI-powered document question-answering system that allows users to upload PDF documents and ask questions about their content.

## Features

* PDF document upload
* Automatic text extraction
* Document chunking
* Semantic embeddings
* FAISS vector similarity search
* Retrieval-Augmented Generation (RAG)
* Context-aware question answering
* Source/page references
* Interactive chatbot interface
* Groq LLM integration

## Architecture

```text
PDF Upload
    ↓
Text Extraction
    ↓
Text Chunking
    ↓
Sentence Embeddings
    ↓
FAISS Vector Database
    ↓
Similarity Search
    ↓
Relevant Context
    ↓
Groq LLM
    ↓
AI Generated Answer
```

## Technologies Used

* Python
* LangChain
* FAISS
* Sentence Transformers
* PyMuPDF
* Groq API
* Gradio
* Google Colab

## How It Works

1. User uploads a PDF document.
2. The application extracts text from the document.
3. The extracted text is divided into smaller chunks.
4. Sentence Transformers generates embeddings for the chunks.
5. FAISS stores the embeddings for similarity search.
6. When the user asks a question, relevant chunks are retrieved.
7. The retrieved context is provided to the LLM.
8. The LLM generates a context-aware answer.

## Setup

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Set your Groq API key securely as an environment variable:

```text
GROQ_API_KEY=your_api_key_here
```

Never commit your API key to GitHub.

## Example Questions

The assistant can answer questions such as:

* What is the main objective of this document?
* Summarize the methodology.
* What are the key findings?
* Explain the conclusion.
* Which page discusses a particular topic?

## Project Status

Working prototype developed and tested in Google Colab.

## Future Improvements

* Multiple document support
* Persistent chat history
* Document comparison
* Improved source citations
* User authentication
* Professional web interface
* Vercel deployment

## Author

Riya Rathod

MSc Data Science
