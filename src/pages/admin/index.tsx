import React, { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  Container,
  Heading,
  Text,
  Divider,
  Button,
  Box,
  Flex,
  Spacer,
  Grid,
  Image,
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
import ChapterCard from '@/components/ChapterCard';

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
      <Box p="10" textAlign="center">
        <Heading>Admin Dashboard</Heading>
        <Divider my={3} />
        <Text>Admin Id: {user.admin.id}</Text>

        <Flex>
          <Heading>Chapters</Heading>
          <Spacer />
          <AddNewChapterButton />
        </Flex>

        <Grid templateColumns="repeat(4, 1fr)" gap={5}>
          <ChapterCard
            name="Chapter"
            image=""
            contact="John Smith"
            email="johnsmith@gmail.com"
          />
        </Grid>

        <ChapterModalController />
      </Box>
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
