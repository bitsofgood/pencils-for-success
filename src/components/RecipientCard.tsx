import { Heading, Flex } from '@chakra-ui/react';
import { Recipient } from '@prisma/client';

interface RecipientCardProps {
  recipient: Recipient;
}

function RecipientCard({ recipient }: RecipientCardProps) {
  return (
    <Flex
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      cursor="pointer"
      direction="column"
      alignItems="baseline"
      padding="5"
    >
      <Heading size="md" paddingBottom="5">
        {recipient.name}
      </Heading>
    </Flex>
  );
}

export default RecipientCard;
