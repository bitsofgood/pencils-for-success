import React, { useContext, useEffect, useState } from 'react';
import { User } from '@prisma/client';
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
import { useForm } from 'react-hook-form';
import { ChapterDetails } from '@/pages/api/chapters/[chapterId]';
import {
  ChapterModalContext,
  ModalState,
} from '@/providers/ChapterModalProvider';
import { ChaptersContext } from '@/providers/ChaptersProvider';
import EditConfirmationModal from './EditConfirmationModal';

interface EditCredentialsForm {
  chapterToEdit: ChapterDetails;
}

const EditCredentialsForm = ({ chapterToEdit }: EditCredentialsForm) => {
  const { activeChapter, setModalState } = useContext(ChapterModalContext);
  const { upsertChapter } = useContext(ChaptersContext);

  const userToEdit = chapterToEdit?.chapterUser?.user || null;

  const [loading, setLoading] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(userToEdit);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<User>({
    defaultValues: {
      ...editedUser,
      hash: '',
    },
  });

  // Manage edit confirmation modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCancel = () => {
    setModalState(ModalState.ViewChapter);
  };

  const onSubmit = async (data: User) => {
    // If valid inputs, open confirmfation modal
    setEditedUser(data);
    onOpen();
  };

  const onConfirmation = async () => {
    alert(
      `Updating the user credentials:\n${JSON.stringify(editedUser, null, 4)}`,
    );
  };

  return (
    <>
      <EditConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirmation={onConfirmation}
        chapter={chapterToEdit}
        message="This action will update user credentials for chapter"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <FormLabel>Credentials</FormLabel>
        </FormControl>

        <FormControl
          isRequired
          isInvalid={errors.username !== undefined}
          my={2}
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
          isInvalid={errors.hash !== undefined}
          my={2}
          id="hash"
        >
          <Input
            placeholder="Password"
            {...register('hash', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Minimum length should be 8',
              },
            })}
            borderColor="black"
          />
          <FormErrorMessage>
            {errors.hash && errors.hash.message}
          </FormErrorMessage>
        </FormControl>

        <Flex my="3">
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

export default EditCredentialsForm;
