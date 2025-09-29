
export const detectLanguageFromCode = (code: string): string | null => {
  if (!code || code.trim().length < 10) {
    return null;
  }

  // Simple heuristics for language detection
  const javaKeywords = [
    /public\s+class/g,
    /import\s+java\./g,
    /System\.out\.println/g,
    /private\s+final/g,
    /public\s+static\s+void/g,
  ];
  const pythonKeywords = [
    /def\s+\w+\(.*\):/g,
    /import\s+\w+/g,
    /print\(.*\)/g,
    /if\s+__name__\s+==\s+['"]__main__['"]:/g,
    /class\s+\w+\(.*\):/g,
  ];

  let javaScore = 0;
  javaKeywords.forEach(regex => {
    const matches = code.match(regex);
    if (matches) {
      javaScore += matches.length;
    }
  });

  let pythonScore = 0;
  pythonKeywords.forEach(regex => {
    const matches = code.match(regex);
    if (matches) {
      pythonScore += matches.length;
    }
  });

  if (javaScore > pythonScore && javaScore > 0) {
    return 'Java';
  }

  if (pythonScore > javaScore && pythonScore > 0) {
    return 'Python';
  }

  return null;
};

export const detectLanguageFromFilename = (filename: string): string | null => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'py':
            return 'Python';
        case 'java':
            return 'Java';
        default:
            return null;
    }
};
