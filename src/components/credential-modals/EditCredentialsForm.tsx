import { User } from '@prisma/client';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import { CredentialsModalContext } from '@/providers/CredentialsModalProvider';
import CredentialsConfirmationModal from '@/components/credential-modals/CredentialsConfirmationModal';

const CredentialsInformationForm = () => {
  const { onClose: closePrimaryModal } = useContext(CredentialsModalContext);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<User>({
    reValidateMode: 'onChange',
  });

  // Manage edit confirmation modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCancel = () => {
    closePrimaryModal();
  };

  const onSubmit = async () => {
    // If valid inputs, open confirmfation modal
    onOpen();
  };

  const onConfirmation = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100))
      .then(() => {
        closePrimaryModal();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CredentialsConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirmation={onConfirmation}
        message="This action will update your credentials."
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          isRequired
          isInvalid={errors.username !== undefined}
          mt={2}
          mb={2}
          id="username"
        >
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            placeholder="Enter username"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 6,
                message: 'Please provide more than 6 characters',
              },
              maxLength: {
                value: 31,
                message: 'Please provide less than 31 characters',
              },
              pattern: {
                value: /^[a-zA-Z0-9_]*$/,
                message: 'Please provide an alphanumeric username',
              },
            })}
            borderColor="black"
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={errors.hash !== undefined}
          mt={2}
          mb={2}
          id="password"
        >
          <Input
            placeholder="Min. 8 characters"
            {...register('hash', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Please provide more than 8 characters',
              },
              maxLength: {
                value: 31,
                message: 'Please provide less than 129 characters',
              },
            })}
            borderColor="black"
          />
          <FormErrorMessage>
            {errors.hash && errors.hash.message}
          </FormErrorMessage>
        </FormControl>

        <Flex mb="2" mt="8">
          <Button
            colorScheme="blue"
            isLoading={isSubmitting || loading}
            disabled={!isDirty}
            type="submit"
          >
            Save
          </Button>

          <Spacer />

          <Button
            disabled={isSubmitting || loading}
            onClick={onCancel}
            variant="ghost"
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default CredentialsInformationForm;
