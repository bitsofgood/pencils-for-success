import React from 'react';
import Login from '@/components/Login';

export default function Admin() {
  function onSubmit() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }

  // eslint-disable-next-line react/jsx-no-bind
  return <Login onSubmit={onSubmit} />;
}
