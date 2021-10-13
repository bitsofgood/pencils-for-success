import React from 'react';
import Login from '@/components/Login';

export default function ChapterLogin() {
  const onSubmit = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });

  return <Login onSubmit={onSubmit} title="Donation Recipient" />;
}
