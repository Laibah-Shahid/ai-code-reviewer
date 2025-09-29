import React from 'react';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  disabled: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, disabled }) => {
  return (
    <div>
      <label htmlFor="code-input" className="block text-sm font-medium text-gray-400 mb-2">
        Paste Code Snippet
      </label>
      <textarea
        id="code-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={disabled}
        placeholder="function helloWorld() { console.log('Hello, World!'); }"
        className="w-full h-72 p-4 font-mono text-sm bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-y disabled:opacity-50"
        spellCheck="false"
      />
    </div>
  );
};

export default CodeInput;
