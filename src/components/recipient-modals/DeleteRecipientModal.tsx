import React, { useContext, useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Button,
  Text,
  Flex,
  Spacer,
  Divider,
} from '@chakra-ui/react';
import {
  RecipientModalContext,
  ModalState,
} from '@/providers/RecipientModalProvider';
import { RecipientsContext } from '@/providers/RecipientsProvider';

const deleteRecipient = async (id: number) => {
  const response = await fetch(`/api/recipient/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();
  if (response.status !== 200) {
    throw Error(responseJson.message);
  }

  if (responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson;
};

const DeleteRecipientModal = () => {
  const { onClose, activeRecipient, setModalState, setActiveRecipient } =
    useContext(RecipientModalContext);
  const { recipients, removeRecipient } = useContext(RecipientsContext);

  const [loading, setLoading] = useState(false);

  const onConfirmation = () => {
    setLoading(true);
    deleteRecipient(activeRecipient)
      .then(() => {
        onClose();
        setModalState(ModalState.NewRecipient);
        removeRecipient(activeRecipient);
        setActiveRecipient(-1);
      })
      .catch((err) => {
        alert(err);
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const recipientToDelete = recipients[activeRecipient];

  const onCancel = () => {
    onClose();
  };

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalBody pb="5" mt="5" textAlign="center">
        {/* Add icon to bring attention to user */}
        <Text fontSize="4xl" my="5">
          Are you sure?
        </Text>
        <Text color="gray.500">This action will delete recipient</Text>
        <Text fontSize="3xl">{recipientToDelete?.name}</Text>
        <Text color="gray.500">This action cannot be undone</Text>
        <Divider my="5" />
        <Flex>
          <Button
            colorScheme="red"
            isLoading={loading}
            onClick={onConfirmation}
          >
            Delete
          </Button>
          <Spacer />
          <Button disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  );
};

export default DeleteRecipientModal;
