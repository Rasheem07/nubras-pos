"use client"
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    // document.documentElement.dir = dir;
  }, [i18n.language]);

  const toggle = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <Button className='h-7' variant={"outline"} onClick={toggle} style={{ padding: '0.5em 1em' }}>
      {i18n.language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
};

export default LanguageSwitcher;
