import React from 'react';
import Login from '@/components/Login';

export default function Admin() {
  const onSubmit = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });

  return <Login onSubmit={onSubmit} title="Admin" />;
}
