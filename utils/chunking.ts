export const CHUNK_SIZE_LINES = 400;

export interface CodeChunk {
  filename: string;
  content: string;
}

/**
 * Splits a code string into chunks and adds contextual headers.
 * @param filename The name of the file being chunked.
 * @param content The string content of the file.
 * @returns An array of CodeChunk objects.
 */
export const chunkCode = (filename: string, content: string): CodeChunk[] => {
  const lines = content.split('\n');
  
  // If the file is small enough, return it as a single chunk with a standard header.
  if (lines.length <= CHUNK_SIZE_LINES) {
    const header = `// FILE: ${filename}\n// Lines: 1-${lines.length}\n\n`;
    return [{ filename, content: `${header}${content}` }];
  }

  const chunks: CodeChunk[] = [];
  const numChunks = Math.ceil(lines.length / CHUNK_SIZE_LINES);

  for (let i = 0; i < lines.length; i += CHUNK_SIZE_LINES) {
    const chunkLines = lines.slice(i, i + CHUNK_SIZE_LINES);
    const chunkContent = chunkLines.join('\n');
    const startLine = i + 1;
    const endLine = i + chunkLines.length;
    const part = i / CHUNK_SIZE_LINES + 1;
    
    const chunkHeader = `// FILE: ${filename} (Part ${part} of ${numChunks})\n// Lines: ${startLine}-${endLine}\n\n`;

    chunks.push({
      filename,
      content: `${chunkHeader}${chunkContent}`,
    });
  }

  return chunks;
};
