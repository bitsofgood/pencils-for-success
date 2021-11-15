import React from 'react';
import Login from '@/components/Login';

export default function Admin() {
  return <Login apiURL="/api/admin/login" directURL="/admin" title="Admin" />;
}
