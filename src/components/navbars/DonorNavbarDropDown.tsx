import { Select } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { Chapter } from '@prisma/client';
import { DonorContext } from '@/providers/DonorProvider';

interface DonorNavbarDropDownProps {
  chapters: Chapter[];
}

export default function DonorNavbarDropDown({
  chapters,
}: DonorNavbarDropDownProps) {
  const { setActiveChapterId } = useContext(DonorContext);

  useEffect(() => {
    setActiveChapterId(chapters[0].id);
  }, []);

  const handleSelect = (e: any) => {
    setActiveChapterId(e.target.value);
  };

  return (
    <Select
      onChange={handleSelect}
      size="md"
      fontWeight="bold"
      w="fit-content"
      cursor="pointer"
      variant="unstyled"
      textAlign="end"
    >
      {chapters.map((chapter) => (
        <option value={chapter.id} key={chapter.id}>
          {chapter.chapterName}
        </option>
      ))}
    </Select>
  );
}
