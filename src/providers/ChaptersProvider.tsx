import { Chapter } from '@prisma/client';
import { createContext, useEffect, useState } from 'react';

export interface ChaptersContextProps {
  chapters: Record<number, Chapter>;
  upsertChapter: (data: Chapter) => void;
  removeChapter: (id: number) => void;
}

export interface ChaptersProviderProps {
  children: JSX.Element;
  initChapters: Chapter[];
}

export const ChaptersContext = createContext<ChaptersContextProps>({
  chapters: {},
  removeChapter: (id: number) => {
    throw Error('Method not implemented');
  },
  upsertChapter: (x: Chapter) => {
    throw Error('Method not implemented');
  },
});

export const ChaptersProvider = ({
  children,
  initChapters,
}: ChaptersProviderProps) => {
  const [chapters, setChapters] = useState<Record<number, Chapter>>({});

  useEffect(() => {
    const parsedChapters: Record<number, Chapter> = {};
    for (let i = 0; i < initChapters.length; i += 1) {
      const currentChapter = initChapters[i];
      parsedChapters[currentChapter.id] = currentChapter;
    }
    setChapters(parsedChapters);
  }, [initChapters]);

  const removeChapter = (id: number) => {
    if (id in chapters) {
      delete chapters[id];
    }
  };

  const upsertChapter = (addChapter: Chapter) => {
    const { id } = addChapter;
    setChapters({
      ...chapters,
      [id]: addChapter,
    });
  };

  return (
    <ChaptersContext.Provider
      value={{
        chapters,
        removeChapter,
        upsertChapter,
      }}
    >
      {children}
    </ChaptersContext.Provider>
  );
};
