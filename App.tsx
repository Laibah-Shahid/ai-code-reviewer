
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import LanguageSelector from './components/LanguageSelector';
import FeedbackDisplay from './components/FeedbackDisplay';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { reviewCode } from './services/geminiService';
import { PROGRAMMING_LANGUAGES } from './constants';
import CodeInput from './components/CodeInput';
import InputModeToggle, { InputMode } from './components/InputModeToggle';
import { chunkCode } from './utils/chunking';
import { detectLanguageFromCode, detectLanguageFromFilename } from './utils/languageDetection';

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(PROGRAMMING_LANGUAGES[0]);
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect language from file extensions
  useEffect(() => {
    if (inputMode === 'upload' && files.length > 0) {
      const firstFileLang = detectLanguageFromFilename(files[0].name);
      if (firstFileLang) {
        const allSameLang = files.every(file => detectLanguageFromFilename(file.name) === firstFileLang);
        if (allSameLang) {
          setLanguage(firstFileLang);
        }
      }
    }
  }, [files, inputMode]);

  // Auto-detect language from code snippet with debounce
  useEffect(() => {
    if (inputMode === 'snippet' && code.trim()) {
      const handler = setTimeout(() => {
        const detectedLang = detectLanguageFromCode(code);
        if (detectedLang) {
          setLanguage(detectedLang);
        }
      }, 500); // 500ms debounce

      return () => {
        clearTimeout(handler);
      };
    }
  }, [code, inputMode]);
  
  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    if (mode === 'upload') {
      setCode('');
    } else {
      setFiles([]);
    }
    setError(null);
    setFeedback('');
  };

  const handleReview = useCallback(async () => {
    const isUploadModeAndEmpty = inputMode === 'upload' && files.length === 0;
    const isSnippetModeAndEmpty = inputMode === 'snippet' && code.trim() === '';
    
    if (isUploadModeAndEmpty) {
      setError('Please upload at least one file to review.');
      return;
    }

    if (isSnippetModeAndEmpty) {
      setError('Please enter a code snippet to review.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFeedback('');

    try {
      let codeToReview: string;

      if (inputMode === 'upload') {
        const fileChunkPromises = files.map(async (file) => {
          const content = await readFileAsText(file);
          return chunkCode(file.name, content);
        });
        const allChunksNested = await Promise.all(fileChunkPromises);
        const allChunksFlat = allChunksNested.flat();
        codeToReview = allChunksFlat.map(chunk => chunk.content).join('\n\n---\n\n');
      } else {
        const chunks = chunkCode('snippet.code', code);
        codeToReview = chunks.map(chunk => chunk.content).join('\n\n---\n\n');
      }
  
      const result = await reviewCode(codeToReview, language);
      setFeedback(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to get review: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [files, language, code, inputMode]);

  const isButtonDisabled = isLoading || (inputMode === 'upload' && files.length === 0) || (inputMode === 'snippet' && code.trim() === '');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="flex flex-col space-y-6">
            <LanguageSelector language={language} setLanguage={setLanguage} disabled={isLoading} />
            <InputModeToggle mode={inputMode} setMode={handleModeChange} disabled={isLoading} />

            {inputMode === 'upload' ? (
              <FileUpload onFilesChange={setFiles} disabled={isLoading} maxFiles={5} />
            ) : (
              <CodeInput code={code} setCode={setCode} disabled={isLoading} />
            )}
            
            <button
              onClick={handleReview}
              disabled={isButtonDisabled}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reviewing...
                </>
              ) : (
                'Review Code'
              )}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="relative">
            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader />}
            {!isLoading && <FeedbackDisplay feedback={feedback} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
