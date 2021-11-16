import React, { useContext } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ErrorResponse } from '@/utils/error';
import { NewSupplyRequestInputBody } from '@/utils/api';

interface NewSupplyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: number;
}

const createNewSupplyRequest = async (
  { quantity, note, item }: NewSupplyRequestInputBody,
  recipientId: number,
) => {
  const response = await fetch(
    `/api/recipients/${recipientId}/supply-requests`,
    {
      method: 'POST',
      body: JSON.stringify({
        quantity,
        note,
        item,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const responseJson = (await response.json()) as ErrorResponse;
  if (response.status !== 200 || responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson;
};

const NewSupplyRequestModal = ({
  isOpen,
  onClose,
  recipientId,
}: NewSupplyRequestModalProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewSupplyRequestInputBody>({});

  const onSubmit = async (data: NewSupplyRequestInputBody) => {
    try {
      console.log(data);
      // await createNewSupplyRequest(data, recipientId);
      reset();
      onClose();
      alert(`Successfully added new supply request`);
    } catch (e) {
      alert(e);
    }
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Supply Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isRequired
              isInvalid={errors.quantity !== undefined}
              mt={2}
              mb={2}
              id="quantity"
            >
              <FormLabel htmlFor="quantity">Quantity</FormLabel>
              <Input
                placeholder="Enter Quantity"
                type="number"
                {...register('quantity', {
                  valueAsNumber: true,
                  min: 1,
                  required: 'Supply Request quantity is required',
                })}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.quantity && errors.quantity.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={2} mb={2} id="note">
              <FormLabel htmlFor="note">Note</FormLabel>
              <Textarea
                placeholder="Enter Note (Optional)"
                {...register('note')}
                borderColor="black"
              />
            </FormControl>
            <SimpleGrid columns={[1, null, 2]} spacing={[0, null, 5]} mt="4">
              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="messenger"
              >
                Submit
              </Button>
              <Button
                isLoading={isSubmitting}
                onClick={closeModal}
                disabled={isSubmitting}
                variant="ghost"
              >
                Cancel
              </Button>
            </SimpleGrid>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewSupplyRequestModal;
