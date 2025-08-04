import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import JSON translation files
import en from './locales/en/translation.json';
import ur from './locales/ur/translation.json';
import es from './locales/es/translation.json';

i18n
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // Default language if detection fails
    debug: false, // Set to true only for development
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      es: { translation: es }
    }
  });

export default i18n;
