import { HStack, Button, Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useContext, useEffect } from 'react';
import { Chapter } from '@prisma/client';
import { GetChapterResponse } from '@/pages/api/chapters';
import { DonorContext, DonorProvider } from '@/providers/DonorProvider';

interface DonorNavbarDropDownProps {
  chapters: Chapter[];
}

export default function DonorNavbarDropDown({
  chapters,
}: DonorNavbarDropDownProps) {
  const { activeChapterId, setActiveChapterId } = useContext(DonorContext);

  useEffect(() => {
    setActiveChapterId(chapters[0].id);
  }, []);

  const handleSelect = (e: any) => {
    setActiveChapterId(e.target.value);
  };

  return (
    <Select onChange={handleSelect} size="sm" variant="outline" w="40%">
      {chapters.map((chapter) => (
        <option value={chapter.id} key={chapter.id}>
          {chapter.chapterName}
        </option>
      ))}
    </Select>
  );
}
