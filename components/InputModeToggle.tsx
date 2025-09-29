import React from 'react';

export type InputMode = 'upload' | 'snippet';

interface InputModeToggleProps {
  mode: InputMode;
  setMode: (mode: InputMode) => void;
  disabled: boolean;
}

const InputModeToggle: React.FC<InputModeToggleProps> = ({ mode, setMode, disabled }) => {
  const baseClasses = "w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50";
  const activeClasses = "bg-cyan-600 text-white";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Input Method
      </label>
      <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setMode('upload')}
          disabled={disabled}
          className={`${baseClasses} ${mode === 'upload' ? activeClasses : inactiveClasses}`}
          aria-pressed={mode === 'upload'}
        >
          File Upload
        </button>
        <button
          onClick={() => setMode('snippet')}
          disabled={disabled}
          className={`${baseClasses} ${mode === 'snippet' ? activeClasses : inactiveClasses}`}
          aria-pressed={mode === 'snippet'}
        >
          Code Snippet
        </button>
      </div>
    </div>
  );
};

export default InputModeToggle;
