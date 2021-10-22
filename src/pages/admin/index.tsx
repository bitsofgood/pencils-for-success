import React, { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  Container,
  Heading,
  Text,
  Divider,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { withAdminAuthPage } from '@/utils/middlewares/auth';
import { SessionAdminUser } from '../api/admin/login';
import { NextIronServerSideContext } from '@/utils/session';
import ChapterModalController, {
  ModalState,
} from '@/components/chapter-modals/ChapterModalController';
import {
  ChapterModalContext,
  ChapterModalProvider,
} from '@/providers/ChapterModalProvider';

interface AdminDashboardProps {
  user: SessionAdminUser;
}

function AddNewChapterButton() {
  const { onOpen, setModalState } = useContext(ChapterModalContext);

  const onNewChapterClick = () => {
    setModalState(ModalState.NewChapter);
    onOpen();
  };

  return <Button onClick={onNewChapterClick}>+ Add New</Button>;
}

export default function AdminDashboardPage({ user }: AdminDashboardProps) {
  return (
    <ChapterModalProvider>
      <Container py="5" textAlign="center">
        <Heading>Admin Dashboard</Heading>
        <Divider my={3} />
        <Text>Admin Id: {user.admin.id}</Text>

        <AddNewChapterButton />
        <ChapterModalController />
      </Container>
    </ChapterModalProvider>
  );
}

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> =
  withAdminAuthPage(async ({ req }: NextIronServerSideContext) => {
    const user = req.session.get('user') as SessionAdminUser;

    return {
      props: { user },
    };
  });
