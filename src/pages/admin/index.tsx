import React from 'react';
import { GetServerSideProps } from 'next';
import { Container, Heading, Text, Divider } from '@chakra-ui/react';
import { withAdminAuthPage } from '@/utils/auth-middleware';
import { SessionAdminUser } from '../api/admin/login';
import { NextIronServerSideContext } from '@/utils/session';

interface AdminDashboardProps {
  user: SessionAdminUser;
}

export default function AdminDashboardPage({ user }: AdminDashboardProps) {
  return (
    <Container py="5" textAlign="center">
      <Heading>Admin Dashboard</Heading>
      <Divider my={3} />
      <Text>Admin Id: {user.admin.id}</Text>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> =
  withAdminAuthPage(async ({ req }: NextIronServerSideContext) => {
    const user = req.session.get('user') as SessionAdminUser;

    return {
      props: { user },
    };
  });
