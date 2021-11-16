import React from 'react';
import Login from '@/components/Login';

export default function RecipientLogin() {
  return (
    <Login
      apiURL="/api/recipients/login"
      directURL="/recipient"
      title="Recipient"
    />
  );
}
