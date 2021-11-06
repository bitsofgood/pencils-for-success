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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { emailRegex } from '@/utils/prisma-validation';
import { ErrorResponse } from '@/utils/error';
import { RecipientsContext } from '@/providers/RecipientsProvider';
import { PostRecipientResponse } from '@/pages/api/recipients';

type NewRecipientFormBody = {
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: number;
  primaryStreetAddress: string;
  secondaryStreetAddress?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

interface NewRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createNewRecipient = async (data: NewRecipientFormBody) => {
  const {
    name,
    email,
    phoneNumber,
    primaryStreetAddress,
    secondaryStreetAddress,
    city,
    state,
    country,
    postalCode,
    username,
    password,
  } = data;

  const recipient = {
    name,
    email,
    phoneNumber,
    primaryStreetAddress,
    secondaryStreetAddress,
    city,
    state,
    country,
    postalCode,
  };

  const newUser = {
    username,
    hash: password,
  };

  const response = await fetch(`/api/recipients`, {
    method: 'POST',
    body: JSON.stringify({
      recipient,
      newUser,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = (await response.json()) as PostRecipientResponse &
    ErrorResponse;
  if (response.status !== 200 || responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson.recipient;
};

const NewRecipientModal = ({ isOpen, onClose }: NewRecipientModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<NewRecipientFormBody>({});

  const { upsertRecipient } = useContext(RecipientsContext);

  const onSubmit = async (data: NewRecipientFormBody) => {
    try {
      const newRecipient = await createNewRecipient(data);
      upsertRecipient(newRecipient);
      onClose();
      alert(`Successfully added new recipient: ${newRecipient.id}`);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Recipient</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isRequired
              isInvalid={errors.name !== undefined}
              mt={2}
              mb={2}
              id="chapterName"
            >
              <FormLabel htmlFor="chapterName">
                Recipient Organization Name
              </FormLabel>
              <Input
                placeholder="Enter Name"
                {...register('name', {
                  required: 'Recipient Organization Name is required',
                })}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Credentials</FormLabel>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={errors.username !== undefined}
              mt={2}
              mb={2}
              id="username"
            >
              <Input
                placeholder="Username"
                {...register('username', {
                  required: 'Username is required',
                })}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={errors.password !== undefined}
              mb={2}
              id="password"
            >
              <Input
                placeholder="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Minimum length should be 8',
                  },
                })}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Contact Info</FormLabel>
            </FormControl>

            <SimpleGrid columns={[1, null, 2]} spacing={[0, null, 5]}>
              <FormControl
                isRequired
                isInvalid={errors.email !== undefined}
                mb={2}
                id="email"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: emailRegex,
                      message: 'Invalid email address',
                    },
                  })}
                  borderColor="black"
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={errors.phoneNumber !== undefined}
                mb={2}
                id="phoneNumber"
              >
                <Input
                  placeholder="Phone Number (Optional)"
                  type="number"
                  {...register('phoneNumber')}
                  borderColor="black"
                />
                <FormErrorMessage>
                  {errors.phoneNumber && errors.phoneNumber.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={errors.primaryStreetAddress !== undefined}
              mb={2}
              id="primaryStreetAddress"
            >
              <Input
                placeholder="Street Address"
                {...register('primaryStreetAddress', {
                  required: 'Street address is required',
                })}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.primaryStreetAddress &&
                  errors.primaryStreetAddress.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.secondaryStreetAddress !== undefined}
              mb={2}
              id="secondaryStreetAddress"
            >
              <Input
                placeholder="Apt, Suite, etc."
                {...register('secondaryStreetAddress')}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.secondaryStreetAddress &&
                  errors.secondaryStreetAddress.message}
              </FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={[1, null, 2]} spacing={[0, null, 2]}>
              <FormControl
                isRequired
                isInvalid={errors.city !== undefined}
                id="city"
              >
                <Input
                  placeholder="City"
                  {...register('city', {
                    required: 'City is required',
                  })}
                  borderColor="black"
                />
                <FormErrorMessage>
                  {errors.city && errors.city.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.state !== undefined} id="state">
                <Input
                  placeholder="State"
                  {...register('state', {
                    required: 'State is required',
                  })}
                  borderColor="black"
                />
                <FormErrorMessage>
                  {errors.state && errors.state.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={errors.country !== undefined}
                id="country"
              >
                <Input
                  placeholder="Country"
                  {...register('country', {
                    required: 'Country is required',
                  })}
                  borderColor="black"
                />
                <FormErrorMessage>
                  {errors.country && errors.country.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={errors.postalCode !== undefined}
                id="postalCode"
              >
                <Input
                  placeholder="Postal Code"
                  {...register('postalCode', {
                    required: 'Postal Code is required',
                  })}
                  borderColor="black"
                />
                <FormErrorMessage>
                  {errors.postalCode && errors.postalCode.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>

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
                onClick={onClose}
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

export default NewRecipientModal;
