import React, { useContext } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  SimpleGrid,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { emailRegex } from '@/utils/prisma-validation';
import { ErrorResponse } from '@/utils/error';
import { RecipientsContext } from '@/providers/RecipientsProvider';
import { PostRecipientResponse } from '@/pages/api/recipients';
import { RecipientModalContext } from '@/providers/RecipientModalProvider';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';

type EditRecipientFormBody = {
  name: string;
  // username: string;
  // password: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  primaryStreetAddress: string;
  secondaryStreetAddress?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

function getActiveRecipient(
  recipientId: number,
  recipients: DetailedRecipient[],
) {
  const filteredRecipients = recipients.filter((x) => x.id === recipientId);
  let activeRecipient = null;
  if (filteredRecipients.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    activeRecipient = filteredRecipients[0];
  }
  return activeRecipient;
}

const editRecipient = async (
  data: EditRecipientFormBody,
  recipientId: number,
) => {
  const response = await fetch(`/api/recipients/${recipientId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
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

const EditRecipientModal = () => {
  const { onClose, activeRecipient } = useContext(RecipientModalContext);
  const { recipients } = useContext(RecipientsContext);
  const activeRecipientInfo = getActiveRecipient(activeRecipient, recipients);
  const { upsertRecipient } = useContext(RecipientsContext);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditRecipientFormBody>({
    defaultValues: {
      name: activeRecipientInfo?.name,
      // username: activeRecipientInfo?.username,
      // password: activeRecipientInfo?.password,
      contactName: activeRecipientInfo?.contactName,
      email: activeRecipientInfo?.email,
      phoneNumber: activeRecipientInfo?.phoneNumber,
      primaryStreetAddress: activeRecipientInfo?.primaryStreetAddress,
      secondaryStreetAddress: activeRecipientInfo?.secondaryStreetAddress,
      city: activeRecipientInfo?.city,
      state: activeRecipientInfo?.state,
      country: activeRecipientInfo?.country,
      postalCode: activeRecipientInfo?.postalCode,
    },
  });

  const onSubmit = async (editedData: EditRecipientFormBody) => {
    try {
      const editedRecipient = await editRecipient(editedData, activeRecipient);
      editedRecipient.supplyRequests = activeRecipientInfo?.supplyRequests;
      editedRecipient.recipientUser = activeRecipientInfo?.recipientUser;

      upsertRecipient(editedRecipient);
      reset();
      onClose();
      alert(`Successfully edited recipient: ${editedRecipient.id}`);
    } catch (e) {
      alert(e);
    }
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>Edit Recipient</ModalHeader>
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
          {/* <FormControl
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
          </FormControl> */}

          <FormControl isRequired>
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
                type="string"
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
              placeholder="Apt, Suite, etc. (Optional)"
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

            <FormControl isInvalid={errors.country !== undefined} id="country">
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
              disabled={!isDirty}
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
  );
};

export default EditRecipientModal;
