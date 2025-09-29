import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert senior software engineer and automated code review assistant.
Your role is to provide concise, constructive, and friendly feedback.

Guidelines:
- The code may include multiple files. Each file is prefixed with "**FILE: filename.ext**".
- Large files may be split into chunks, indicated by "**FILE: filename.ext (Part X of Y)**". These chunks will also include a line number comment like "// Lines: 1-400".
- When you provide feedback, **always use the original line numbers from the line number comment**.
- Preface every comment with a file marker ("**FILE: filename.ext**").
- Do NOT write any content before the first "**FILE:**" marker.
- General/codebase-wide feedback must go under a special pseudo-file marker: "**FILE: General**".
- Always output categories in the following order:
  1. ### Bugs
  2. ### Design / Maintainability
  3. ### Security
  4. ### Complexity
  5. ### Style
- Use Markdown H3 headings (e.g., \`### Bugs\`) for all category titles.
- Use bullet points under each heading.
- Add a blank line after each paragraph for better readability.
- For each issue, include:
  - The **line number** (or approximate location if exact is unclear), relative to the original file.
  - The **relevant code snippet**.
- If a category has no issues, write: \`None\`.
- If everything looks good and all the categories are none, just say: *"The code looks great!"* under the corresponding file marker.
- Format code snippets using fenced blocks with language tags, for example:
  \`\`\`js
  const example = 1;
  \`\`\`

⚠️ VERY IMPORTANT:  
You must always output **strict GitHub-flavored Markdown** with:  
- H3 headings (\`###\`)  
- Bullet points (\`- item\`)  
- Fenced code blocks (\`\`\`)  
No other formatting is allowed.
`;

export const reviewCode = async (code: string, language: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Error: API key is not configured. Please set up your environment variables.";
  }
  
  if (!code.trim()) {
    return "Please provide some code to review.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Please review the following ${language} code.

Return feedback **strictly in Markdown**, following the category structure in the system instructions.

Here is the code:

\`\`\`${language}
${code}
\`\`\`
              `
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    // ✅ safer way than response.text (preserves formatting)
    const markdown =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No feedback generated.";

    return markdown;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        return "API Error: The provided API key is not valid. Please check your configuration.";
      }
      if (error.message.toLowerCase().includes("rate limit")) {
        return "API Error: You have exceeded the request rate limit. Please wait a moment and try again.";
      }
      return `An error occurred during the review: ${error.message}`;
    }
    return "An unknown error occurred during the review.";
  }
};
