import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import '../service/i18n';

const initialState = {
  language: 'en',
  setLanguage: () => {},
  changeLanguage: () => {}
};

const LanguageContext = createContext(initialState);

LanguageContextProvider.propTypes = {
  children: PropTypes.node
};

function LanguageContextProvider({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem('hivehub_language') || 'en');
  useEffect(() => {
    i18n.changeLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <LanguageContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        language,
        setLanguage,
        changeLanguage: (lang) => {
          localStorage.setItem('hivehub_language', lang);
          i18n.changeLanguage(lang).catch(console.log);
        }
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

const useLanguageContext = () => useContext(LanguageContext);

export { LanguageContextProvider, LanguageContext, useLanguageContext };
