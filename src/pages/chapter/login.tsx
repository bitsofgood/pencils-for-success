import React from 'react';
import Login from '@/components/Login';

export default function ChapterLogin() {
  return (
    <Login apiURL="/api/chapters/login" directURL="/chapter" title="Chapter" />
  );
}
