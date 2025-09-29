
import React from 'react';
import { PROGRAMMING_LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
  disabled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage, disabled }) => {
  return (
    <div>
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-400 mb-2">
        Language
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        disabled={disabled}
        className="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
      >
        {PROGRAMMING_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
