import { HStack, Button, Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import NavbarContainer from './NavbarContainer';
import { GetChapterResponse } from '@/pages/api/chapters';

export default function DonorNavbar() {
  const router = useRouter();
  const { data, error } = useSWR<GetChapterResponse>(`/api/chapters`);
  return (
    <NavbarContainer>
      <HStack spacing="15px">
        <Select size="sm" variant="outline" w="40%">
          {data?.chapters.map((chapter) => (
            <option key={chapter.id}>{chapter.chapterName}</option>
          ))}
        </Select>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/recipient/login')}
        >
          Recipient Login
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/chapter/login')}
        >
          Chapter Login
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/admin/login')}
        >
          Admin Login
        </Button>
      </HStack>
    </NavbarContainer>
  );
}
