import React, { createContext, useState, useContext, useEffect } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialLanguage = () => {
    // Check if a language is already saved in localStorage
    const savedLanguage = localStorage.getItem('appLanguage');
    return savedLanguage || 'jp'; // Default to Japanese if no saved language
  };

  const [language, setLanguage] = useState<string>(getInitialLanguage);

  useEffect(() => {
    // Save the selected language to localStorage whenever it changes
    localStorage.setItem('appLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
