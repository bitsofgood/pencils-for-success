import { createContext, useEffect, useState } from 'react';
import { Chapter } from '@prisma/client';
import { ChapterDetails } from '@/pages/api/chapters/[chapterId]';

export interface DonorContextProps {
  activeChapterId: number;
  setActiveChapterId: (data: number) => void;
}

export interface DonorProviderProps {
  children: JSX.Element;
}

export const DonorContext = createContext<DonorContextProps>({
  activeChapterId: -1,
  setActiveChapterId: (x: number) => {
    throw Error('Method not implemented');
  },
});

export const DonorProvider = ({ children }: DonorProviderProps) => {
  const [activeChapterId, setActiveChapterId] = useState<number>(0);

  return (
    <DonorContext.Provider
      value={{
        activeChapterId,
        setActiveChapterId,
      }}
    >
      {children}
    </DonorContext.Provider>
  );
};
