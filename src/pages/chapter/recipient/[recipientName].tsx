import { Container, Heading } from '@chakra-ui/react';

interface RecipientMapPageProps {
  recipientName: string;
}

interface IStaticPropsContextParams {
  params: {
    recipientName: string;
  };
}

export default function RecipientMapPage({
  recipientName,
}: RecipientMapPageProps) {
  return (
    <Container py="5">
      <Heading textAlign="center">Supply Requests</Heading>
    </Container>
  );
}

export async function getStaticPaths() {
  // TODO: Retrieve the data from the database
  const recipients = ['1', '2', '3'];

  const paths = recipients.map((recipientName) => ({
    params: { recipientName },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: IStaticPropsContextParams) {
  const { recipientName } = params;

  return { props: { recipientName } };
}
