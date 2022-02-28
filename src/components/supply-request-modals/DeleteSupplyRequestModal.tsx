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
  SupplyRequestModalContext,
  ModalState,
} from '@/providers/SupplyRequestModalProvider';
import { RecipientsContext } from '@/providers/RecipientsProvider';

const deleteSupplyRequest = async (supplyId: number, recId: number) => {
  const response = await fetch(
    `/api/recipients/${recId}/supply-requests/${supplyId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const responseJson = await response.json();
  if (response.status !== 200) {
    throw Error(responseJson.message);
  }
  if (responseJson.error) {
    throw Error(responseJson.message);
  }
  return responseJson;
};
const DeleteSupplyRequestModal = () => {
  const {
    onClose,
    activeSupplyRequestId,
    activeRecipientId,
    setModalState,
    setActiveSupplyRequestId,
  } = useContext(SupplyRequestModalContext);
  const { recipients, upsertRecipient } = useContext(RecipientsContext);
  const [loading, setLoading] = useState(false);
  const onConfirmation = () => {
    setLoading(true);
    deleteSupplyRequest(activeSupplyRequestId, activeRecipientId)
      .then(() => {
        onClose();
        setModalState(ModalState.NewSupplyRequest);
        upsertRecipient(recipients[activeRecipientId]);
        setActiveSupplyRequestId(-1);
      })
      .catch((err) => {
        alert(err);
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        <Text color="gray.500">
          This action will delete this supply request
        </Text>
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
export default DeleteSupplyRequestModal;