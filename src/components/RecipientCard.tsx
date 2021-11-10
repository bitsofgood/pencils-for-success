import { Heading, Flex } from '@chakra-ui/react';
import { Recipient } from '@prisma/client';

interface RecipientCardProps {
  recipient: Recipient;
  isActive?: boolean;
  onClick: (id: number) => void;
}

function RecipientCard({ recipient, onClick }: RecipientCardProps) {
  return (
    <Flex
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      cursor="pointer"
      direction="column"
      alignItems="baseline"
      bg="white"
      padding="5"
      onClick={() => onClick(recipient.id)}
    >
      <Heading size="md" paddingBottom="5">
        {recipient.name}
      </Heading>
    </Flex>
  );
}

export default RecipientCard;
