import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import { useSWRConfig } from 'swr';
import { CredentialsModalContext } from '@/providers/CredentialsModalProvider';
import CredentialsConfirmationModal from '@/components/credential-modals/CredentialsConfirmationModal';
import { emailRegex } from '@/utils/prisma-validation';

interface EditedCredentials {
  username: string;
  hash: string;
  contactName: string;
  email: string;
  phoneNumber: string;
}

const EditCredentialsChapterForm = () => {
  const {
    user,
    credentialsData,
    onClose: closePrimaryModal,
  } = useContext(CredentialsModalContext);
  const [loading, setLoading] = useState(false);
  const [editedUsername, setEditedUsername] = useState<string>('');
  const [editedPassword, setEditedPassword] = useState<string>('');
  const [editedContactName, setEditedContactName] = useState<string>('');
  const [editedEmail, setEditedEmail] = useState<string>('');
  const [editedPhoneNumber, setEditedPhoneNumber] = useState<string>('');
  const { mutate } = useSWRConfig();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditedCredentials>({
    reValidateMode: 'onChange',
    defaultValues: {
      username: credentialsData?.chapter?.chapterUser?.user?.username,
      contactName: credentialsData?.chapter?.contactName,
      email: credentialsData?.chapter?.email,
      phoneNumber: credentialsData?.chapter?.phoneNumber,
    },
  });

  // Manage edit confirmation modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCancel = () => {
    closePrimaryModal();
  };

  const onSubmit = async (data: EditedCredentials) => {
    // If valid inputs, open confirmfation modal
    setEditedUsername(data.username);
    setEditedPassword(data.hash);
    setEditedContactName(data.contactName);
    setEditedEmail(data.email);
    setEditedPhoneNumber(data.phoneNumber);
    onOpen();
  };

  const editUser = async (username: string, password: string) => {
    const response = await fetch(
      `/api/chapters/users/${user?.chapterUser?.userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUsername: username, newPassword: password }),
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

  const editChapter = async (
    newContactName: string,
    newEmail: string,
    newPhoneNumber: string,
  ) => {
    const response = await fetch(
      `/api/chapters/${user?.chapterUser?.chapterId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedChapter: {
            chapterName: credentialsData?.chapter?.chapterName,
            chapterSlug: credentialsData?.chapter?.chapterSlug,
            contactName: newContactName,
            email: newEmail,
            phoneNumber: newPhoneNumber,
          },
        }),
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

  const onConfirmation = async () => {
    setLoading(true);
    editChapter(editedContactName, editedEmail, editedPhoneNumber)
      .then(() => {
        // update all swr calls
        mutate(`/api/chapters/${user?.chapterUser?.chapterId}`);
        closePrimaryModal();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => setLoading(false));
    // editUser(editedUsername, editedPassword)
    //   .then(() => {
    //     // update all swr calls
    //     mutate(`/api/chapters/${user?.chapterUser?.chapterId}`);
    //     closePrimaryModal();
    //   })
    //   .catch((err) => {
    //     alert(err);
    //   })
    //   .finally(() => setLoading(false));
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
        {/* <FormControl
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
            type="password"
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
        </FormControl> */}

        <FormControl mt="0px" isRequired>
          <FormLabel>Contact Info</FormLabel>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={errors.contactName !== undefined}
          mb={2}
          id="contactName"
        >
          <Input
            placeholder="Contact Name"
            type="contactName"
            {...register('contactName', {
              required: 'Email is required',
            })}
            borderColor="black"
          />
          <FormErrorMessage>
            {errors.contactName && errors.contactName.message}
          </FormErrorMessage>
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
              {...register('phoneNumber')}
              borderColor="black"
            />
            <FormErrorMessage>
              {errors.phoneNumber && errors.phoneNumber.message}
            </FormErrorMessage>
          </FormControl>
        </SimpleGrid>

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

export default EditCredentialsChapterForm;
