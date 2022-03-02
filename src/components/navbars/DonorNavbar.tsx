import { HStack, Button, Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useContext } from 'react';
import { Chapter } from '@prisma/client';
import NavbarContainer from './NavbarContainer';
import { GetChapterResponse } from '@/pages/api/chapters';
import DonorNavbarDropDown from './DonorNavbarDropDown';
import { DonorContext, DonorProvider } from '@/providers/DonorProvider';

export default function DonorNavbar() {
  const router = useRouter();
  const { data, error } = useSWR<GetChapterResponse>(`/api/chapters`);

  return (
    <NavbarContainer>
      <HStack spacing="15px">
        {data && <DonorNavbarDropDown chapters={data.chapters} />}
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
