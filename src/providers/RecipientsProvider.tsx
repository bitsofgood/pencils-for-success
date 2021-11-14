import { createContext, useEffect, useState } from 'react';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';

export interface RecipientsContextProps {
  recipients: DetailedRecipient[];
  chapterId: number;
  loading: boolean;
  error?: string;
  upsertRecipient: (data: DetailedRecipient) => void;
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
  upsertRecipient: (x: DetailedRecipient) => {
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

  return responseJson.recipients as DetailedRecipient[];
};

export const RecipientsProvider = ({
  children,
  chapterId,
}: ChaptersProviderProps) => {
  const [recipients, setRecipients] = useState<DetailedRecipient[]>([]);
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

  const upsertRecipient = (data: DetailedRecipient) => {
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
