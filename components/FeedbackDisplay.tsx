import React, { useState, useMemo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FeedbackTab {
  title: string;
  content: string;
}

const FeedbackDisplay: React.FC<{ feedback: string }> = ({ feedback }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const tabs = useMemo<FeedbackTab[]>(() => {
    if (!feedback.trim()) return [];

    const fileRegex = /\*\*FILE: (.*?)\*\*/g;
    const parts = feedback.split(fileRegex);

    if (parts.length === 1) {
      return [{ title: "Review", content: parts[0].trim() }];
    }

    const contentMap = new Map<string, string[]>();

    for (let i = 1; i < parts.length; i += 2) {
      const filename = parts[i].trim();
      const content = parts[i + 1] ? parts[i + 1].trim() : "";

      if (filename && content) {
        if (!contentMap.has(filename)) {
          contentMap.set(filename, []);
        }
        contentMap.get(filename)!.push(content);
      }
    }

    const result: FeedbackTab[] = [];

    if (contentMap.has("General")) {
      result.push({
        title: "General",
        content: contentMap.get("General")!.join("\n\n"),
      });
      contentMap.delete("General");
    }

    contentMap.forEach((contents, title) => {
      result.push({
        title,
        content: contents.join("\n\n"),
      });
    });

    return result;
  }, [feedback]);

  useEffect(() => {
    setActiveTab(0);
  }, [tabs]);

  const handleCopy = () => {
    if (tabs.length > 0 && tabs[activeTab]) {
      navigator.clipboard
        .writeText(tabs[activeTab].content)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy feedback:", err);
          alert("Failed to copy feedback.");
        });
    }
  };

  const handleDownload = () => {
    if (tabs.length > 0) {
      const fullFeedback = tabs
        .map((tab) => {
          return `## Feedback for: ${tab.title}\n\n${tab.content}`;
        })
        .join("\n\n---\n\n");

      const blob = new Blob([fullFeedback], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "feedback.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!feedback) {
    return (
      <div className="flex items-center justify-center h-full mt-8 lg:mt-0 p-6 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-500">
        <p>Your code review will appear here.</p>
      </div>
    );
  }

  const showTabs = tabs.length > 1;

 return (
  <div className="mt-8 lg:mt-0 bg-gray-800 border border-gray-700 rounded-lg h-[80vh] flex flex-col">
    {/* Header */}
    <div className="p-6 border-b border-gray-600 flex-shrink-0 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-100">Review Feedback</h2>
      {tabs.length > 0 && (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-3 rounded-md transition text-sm flex items-center"
            aria-live="polite"
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-3 rounded-md transition text-sm flex items-center"
          >
            Download
          </button>
        </div>
      )}
    </div>

    {/* Tabs */}
    {showTabs && (
      <div className="flex flex-wrap border-b border-gray-600 px-4 flex-shrink-0">
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            onClick={() => setActiveTab(index)}
            className={`py-3 px-4 text-sm font-medium transition-colors duration-200 focus:outline-none ${
              activeTab === index
                ? "border-b-2 border-cyan-400 text-cyan-300"
                : "text-gray-400 hover:text-white"
            }`}
            aria-current={activeTab === index ? "page" : undefined}
          >
            {tab.title}
          </button>
        ))}
      </div>
    )}

    {/* Scrollable Feedback Body */}
    <div className="flex-1 overflow-y-auto p-6">
      <div
        className="prose prose-invert max-w-none
          prose-p:text-gray-300 prose-li:text-gray-300 prose-li:list-disc prose-ul:pl-6
          prose-h3:font-bold prose-h3:text-xl prose-h3:text-cyan-400 prose-h3:tracking-wide
          prose-h3:border-b prose-h3:border-gray-700 prose-h3:pb-2 prose-h3:mb-4 prose-h3:mt-6 prose-h3:first:mt-0"
      >
        {tabs.length > 0 && tabs[activeTab] && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ node, ...props }) => (
                <pre
                  className="bg-gray-900 rounded-md p-4 my-4 overflow-x-auto text-sm"
                  {...props}
                />
              ),
              code: ({ node, inline, className, children, ...props }: any) => {
                if (inline) {
                  return (
                    <code
                      className="bg-gray-700 text-cyan-300 py-0.5 px-1 rounded-md font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              h3: ({ node, ...props }) => (
                <h3
                  className="font-bold text-xl text-cyan-400 border-b border-gray-700 pb-2 mb-4 mt-6"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-gray-300" {...props} />
              ),
            }}
          >
            {tabs[activeTab].content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  </div>
);

};

export default FeedbackDisplay;
