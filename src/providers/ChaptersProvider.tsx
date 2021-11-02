import { createContext, useEffect, useState } from 'react';
import { ChapterDetails } from '@/pages/api/chapters/[chapterId]';

export interface ChaptersContextProps {
  chapters: Record<number, ChapterDetails>;
  upsertChapter: (data: ChapterDetails) => void;
  removeChapter: (id: number) => void;
}

export interface ChaptersProviderProps {
  children: JSX.Element;
  initChapters: ChapterDetails[];
}

export const ChaptersContext = createContext<ChaptersContextProps>({
  chapters: {},
  removeChapter: (id: number) => {
    throw Error('Method not implemented');
  },
  upsertChapter: (x: ChapterDetails) => {
    throw Error('Method not implemented');
  },
});

export const ChaptersProvider = ({
  children,
  initChapters,
}: ChaptersProviderProps) => {
  const [chapters, setChapters] = useState<Record<number, ChapterDetails>>({});

  useEffect(() => {
    const parsedChapters: Record<number, ChapterDetails> = {};
    for (let i = 0; i < initChapters.length; i += 1) {
      const currentChapter = initChapters[i];
      parsedChapters[currentChapter.id] = currentChapter;
    }
    setChapters(parsedChapters);
  }, [initChapters]);

  const removeChapter = (id: number) => {
    const newChapters = { ...chapters };
    delete newChapters[id];
    setChapters(newChapters);
  };

  const upsertChapter = (addChapter: ChapterDetails) => {
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
