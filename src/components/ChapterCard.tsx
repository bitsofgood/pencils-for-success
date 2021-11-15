import {
  Heading,
  Text,
  Flex,
  Box,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Stack,
  Divider,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import {
  BsFillTrashFill,
  BsPencilFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import {
  ChapterModalContext,
  ModalState,
} from '@/providers/ChapterModalProvider';
import { ChapterDetails } from '@/pages/api/chapters/[chapterId]';

interface ChapterCardProps {
  chapter: ChapterDetails;
}

interface ChapterFieldProps {
  label: string;
  text: string;
}

interface ContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

function ChapterCardField({ label, text }: ChapterFieldProps) {
  return (
    <Box pt="2" d="flex">
      <Text mr="1" fontWeight="bold">
        {label}:
      </Text>
      <Text>{text}</Text>
    </Box>
  );
}

function ChapterContextMenu({ onEdit, onDelete }: ContextMenuProps) {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box>
          <BsThreeDotsVertical />
        </Box>
      </PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverBody width="200px">
          <Stack>
            <Flex color="gray.700" onClick={onEdit}>
              <BsPencilFill />
              <Text ml="3">Edit Chapter</Text>
            </Flex>

            <Divider />

            <Flex color="red" onClick={onDelete}>
              <BsFillTrashFill />
              <Text ml="3">Delete Chapter</Text>
            </Flex>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function ChapterCard({ chapter }: ChapterCardProps) {
  const { onOpen, setModalState, setActiveChapter } =
    useContext(ChapterModalContext);

  const onEditChapter = () => {
    setActiveChapter(chapter.id);
    setModalState(ModalState.EditChapter);
    onOpen();
  };

  const onDeleteChapter = () => {
    setActiveChapter(chapter.id);
    setModalState(ModalState.DeleteChapter);
    onOpen();
  };

  return (
    <Flex
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      cursor="pointer"
      direction="column"
      alignItems="baseline"
      padding="5"
    >
      <Flex w="100%">
        <Heading size="md" mb="2">
          {chapter.chapterName}
        </Heading>
        <Spacer />
        <ChapterContextMenu onEdit={onEditChapter} onDelete={onDeleteChapter} />
      </Flex>

      <ChapterCardField label="Name" text={chapter.contactName} />
      <ChapterCardField
        label="Username"
        text={chapter.chapterUser?.user?.username || ''}
      />
      <ChapterCardField label="Email" text={chapter.email} />
      <ChapterCardField label="Phone Number" text={chapter.phoneNumber || ''} />
    </Flex>
  );
}

export default ChapterCard;
