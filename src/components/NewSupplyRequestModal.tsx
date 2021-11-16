import React from 'react';
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
  Select,
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import { ErrorResponse } from '@/utils/error';
import { NewSupplyRequestInputBody } from '@/utils/api';
import { GetItemsResponse } from '@/pages/api/items';

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
  mutate(`/api/recipients/${recipientId}/supply-requests`);

  return responseJson;
};

const NewSupplyRequestModal = ({
  isOpen,
  onClose,
  recipientId,
}: NewSupplyRequestModalProps) => {
  // TODO: handle error
  const { data: itemsData, error } = useSWR<GetItemsResponse>('/api/items');
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewSupplyRequestInputBody>({});

  const onSubmit = async (formData: {
    quantity: number;
    note: string;
    item: string;
  }) => {
    try {
      await createNewSupplyRequest(
        {
          quantity: formData.quantity,
          note: formData.note,
          item: {
            id: Number(formData.item),
          },
        },
        recipientId,
      );
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
              isInvalid={errors.item !== undefined}
              mt={2}
              mb={2}
              id="item"
            >
              <FormLabel htmlFor="item">Item</FormLabel>
              <Select
                placeholder="Select Item Type"
                {...register('item', {
                  required: 'Supply Request item type is required',
                })}
              >
                {itemsData &&
                  itemsData.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Select>
              <FormErrorMessage>
                {errors.item && errors.item.id}
              </FormErrorMessage>
            </FormControl>
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
