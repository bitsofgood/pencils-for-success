import { Container, Heading } from '@chakra-ui/react';

interface ChapterMapPageProps {
  chapterName: string;
}

interface IStaticPropsContextParams {
  params: {
    chapterName: string;
  };
}

export default function ChapterMapPage({ chapterName }: ChapterMapPageProps) {
  return (
    <Container py="5">
      <Heading textAlign="center">{chapterName.toUpperCase()}</Heading>
    </Container>
  );
}

export async function getStaticPaths() {
  // TODO: Retrieve the data from the database
  const chapters = ['georgia', 'kansas', 'texas'];

  const paths = chapters.map((chapterName) => ({
    params: { chapterName },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: IStaticPropsContextParams) {
  const { chapterName } = params;

  return { props: { chapterName } };
}
