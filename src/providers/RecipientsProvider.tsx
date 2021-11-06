import { createContext, useEffect, useState } from 'react';
import { Recipient } from '@prisma/client';

export interface RecipientsContextProps {
  recipients: Recipient[];
  chapterId: number;
  loading: boolean;
  error?: string;
  upsertRecipient: (data: Recipient) => void;
  removeRecipient: (id: number) => void;
}

export interface ChaptersProviderProps {
  children: JSX.Element;
  chapterId: number;
}

export const RecipientsContext = createContext<RecipientsContextProps>({
  recipients: [],
  chapterId: -1,
  loading: true,
  removeRecipient: (id: number) => {
    throw Error('Method not implemented');
  },
  upsertRecipient: (x: Recipient) => {
    throw Error('Method not implemented');
  },
});

const getRecipients = async (chapterId: number) => {
  if (!chapterId || chapterId < 0) {
    throw Error('Please provide a valid chapter id');
  }

  const response = await fetch(`/api/chapters/${chapterId}/recipients`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();
  if (response.status !== 200 || responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson.recipients as Recipient[];
};

export const RecipientsProvider = ({
  children,
  chapterId,
}: ChaptersProviderProps) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getRecipients(chapterId)
      .then((data) => setRecipients(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [chapterId]);

  const removeRecipient = (id: number) => {
    const filteredRecipients = recipients.filter((x) => x.id !== id);
    setRecipients(filteredRecipients);
  };

  const upsertRecipient = (data: Recipient) => {
    // Check if existing recipient
    const recipientIndex = recipients.findIndex((x) => x.id === data.id);
    const newRecipients = [...recipients];
    if (recipientIndex >= 0) {
      newRecipients[recipientIndex] = data;
    } else {
      newRecipients.push(data);
    }

    setRecipients(newRecipients);
  };

  return (
    <RecipientsContext.Provider
      value={{
        chapterId,
        recipients,
        loading,
        error,
        removeRecipient,
        upsertRecipient,
      }}
    >
      {children}
    </RecipientsContext.Provider>
  );
};
