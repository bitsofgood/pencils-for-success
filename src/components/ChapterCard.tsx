import {
  Heading,
  Text,
  Flex,
  Box,
  Spacer,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import {
  BsFillTrashFill,
  BsPencilFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import {
  ChapterModalContext,
  ChapterModalState,
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
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Chapter Actions"
        icon={<BsThreeDotsVertical />}
        variant="ghost"
      />
      <MenuList>
        <MenuItem color="gray.700" icon={<BsPencilFill />} onClick={onEdit}>
          Edit Chapter
        </MenuItem>
        <MenuItem color="red" icon={<BsFillTrashFill />} onClick={onDelete}>
          Delete Chapter
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function ChapterCard({ chapter }: ChapterCardProps) {
  const { onOpen, setModalState, setActiveChapter } =
    useContext(ChapterModalContext);

  const onEditChapter = () => {
    setActiveChapter(chapter.id);
    setModalState(ChapterModalState.EditChapter);
    onOpen();
  };

  const onDeleteChapter = () => {
    setActiveChapter(chapter.id);
    setModalState(ChapterModalState.DeleteChapter);
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
