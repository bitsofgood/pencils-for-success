/* eslint-disable react/jsx-key */
import { ReactChild, ReactFragment, ReactPortal, useMemo } from 'react';
import {
  Flex,
  IconButton,
  Text,
  Tooltip,
  Button,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Stack,
  Divider,
  useControllableState,
} from '@chakra-ui/react';
import { useTable, usePagination, Column } from 'react-table';
import {
  BsThreeDots,
  BsChevronLeft,
  BsChevronRight,
  BsPencilFill,
  BsTrashFill,
  BsCaretDownFill,
} from 'react-icons/bs';
import { DetailedSupplyRequest } from '@/pages/api/recipients/[recId]/supply-requests';

interface SupplyRequestListProps {
  data: DetailedSupplyRequest[];
}

function RowContextMenu() {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          aria-label="Edit Supply Request"
          icon={<BsThreeDots />}
        />
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverArrow />
        <PopoverBody width="auto">
          <Stack>
            <Button
              fontWeight="normal"
              variant="ghost"
              color="gray.700"
              alignItems="center"
              justifyContent="flex-start"
              onClick={() => console.log('Edit status')}
            >
              <BsPencilFill />
              <Text ml="3">Edit Supply Request</Text>
            </Button>

            <Button
              fontWeight="normal"
              variant="ghost"
              color="red"
              alignItems="center"
              justifyContent="flex-start"
              onClick={() => console.log('Delete status')}
            >
              <BsTrashFill />
              <Text ml="3">Delete Supply Request</Text>
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function NotesContextMenu(note: string) {
  const [isOpen, setIsOpen] = useControllableState({ defaultValue: false });
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          variant="ghost"
          display="flex"
          alignItems="center"
          cursor="pointer"
          fontWeight="normal"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <BsCaretDownFill transform={isOpen ? 'rotate(180)' : 'rotate(0)'} />
          <Text marginLeft={1.5}>Notes</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="auto"
        onBlur={() => {
          setIsOpen(false);
        }}
      >
        <PopoverArrow />
        <PopoverBody width="auto">
          <Box>{note}</Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function StatusContextMenu(currentStatus: string) {
  const status: string = currentStatus;
  const [isOpen, setIsOpen] = useControllableState({ defaultValue: false });
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Flex
          backgroundColor={status === 'PENDING' ? '#FFF8E7' : '#E0F0FF'}
          color={status === 'PENDING' ? '#CA9000' : '#0A5093'}
          paddingLeft="3"
          paddingRight="3"
          paddingTop="2"
          paddingBottom="2"
          fontWeight="bold"
          borderRadius="8"
          alignItems="center"
          cursor="pointer"
          _hover={{
            backgroundColor: status === 'PENDING' ? '#FFF0CC' : '#C7E4FF',
          }}
          transitionDuration="0.2s"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Box marginRight={2}>
            <BsCaretDownFill transform={isOpen ? 'rotate(180)' : 'rotate(0)'} />
          </Box>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        width="auto"
        onBlur={() => {
          setIsOpen(false);
        }}
      >
        <PopoverBody width="auto">
          <Box
            backgroundColor={status === 'PENDING' ? '#E0F0FF' : '#FFF8E7'}
            color={status === 'PENDING' ? '#0A5093' : '#CA9000'}
            paddingLeft="3"
            paddingRight="3"
            paddingTop="2"
            paddingBottom="2"
            fontWeight="bold"
            borderRadius="8"
            cursor="pointer"
            onClick={() =>
              console.log(
                `Change to ${status === 'PENDING' ? 'Complete' : 'Pending'}`,
              )
            }
            _hover={{
              backgroundColor: status === 'PENDING' ? '#C7E4FF' : '#FFF0CC',
            }}
            transitionDuration="0.2s"
          >
            {status === 'PENDING' ? 'Complete' : 'Pending'}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default function SupplyRequestList({ data }: SupplyRequestListProps) {
  const columns = useMemo<Column<DetailedSupplyRequest>[]>(
    () => [
      {
        Header: 'Item Name',
        accessor: (row) => row.item.name,
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Last Updated',
        accessor: 'lastUpdated',
      },
      {
        Header: 'Created',
        accessor: 'created',
      },
      {
        Header: 'Notes',
        accessor: 'note',
      },
    ],
    [],
  );

  const columnWidths = ['20%', '10%', '20%', '12.5%', '12.5%', '15%', '10%'];

  const {
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
    state: { pageIndex },
  } = useTable<DetailedSupplyRequest>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination,
  );
  // Render the UI for your table
  return (
    <>
      <Box width="100%">
        {headerGroups.map((headerGroup) => (
          <Box
            display="flex"
            flexDirection="row"
            backgroundColor="#F0F0F0"
            textColor="#858585"
            borderRadius="8px"
            paddingTop={4}
            paddingBottom={4}
            paddingLeft={6}
            paddingRight={6}
            marginBottom={6}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column, index) => (
              <Box
                fontSize="16px"
                fontWeight="bold"
                width={columnWidths[index]}
                marginLeft={1}
                marginRight={1}
                {...column.getHeaderProps()}
              >
                {column.render('Header')}
              </Box>
            ))}
            <Box
              display="flex"
              fontSize="16px"
              width={columnWidths[columnWidths.length - 1]}
              alignItems="center"
              justifyContent="flex-end"
              marginLeft={1}
              marginRight={1}
            />
          </Box>
        ))}
      </Box>

      <Box width="100%" display="flex" flexDirection="column">
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              border="2px solid #AEAEAE"
              borderRadius="8px"
              paddingTop={4}
              paddingBottom={4}
              paddingLeft={6}
              paddingRight={6}
              marginBottom={6}
            >
              {row.cells.map((cell, index) => {
                let cellBody;
                // render status cell
                if (cell.column.Header === 'Status') {
                  cellBody = StatusContextMenu(cell.value);
                }
                // render date cells
                else if (
                  cell.column.Header === 'Last Updated' ||
                  cell.column.Header === 'Created'
                ) {
                  const fullDate = cell.value.substring(0, 10);
                  const year = fullDate.substring(0, 4);
                  const month = fullDate.substring(5, 7);
                  const day = fullDate.substring(8, 10);
                  cellBody = `${month}/${day}/${year}`;
                } else if (cell.column.Header === 'Notes') {
                  console.log(cell.value);
                  if (cell.value === '') {
                    cellBody = <></>;
                  } else {
                    cellBody = NotesContextMenu(cell.value);
                  }
                }
                // render default cells
                else {
                  cellBody = cell.render('Cell');
                }
                return (
                  <Box
                    display="flex"
                    fontSize="16px"
                    width={columnWidths[index]}
                    alignItems="center"
                    marginLeft={1}
                    marginRight={1}
                    {...cell.getCellProps()}
                  >
                    {cellBody}
                  </Box>
                );
              })}
              <Box
                display="flex"
                fontSize="16px"
                width={columnWidths[columnWidths.length - 1]}
                alignItems="center"
                justifyContent="flex-end"
                marginLeft={1}
                marginRight={1}
                cursor="pointer"
              >
                <RowContextMenu />
              </Box>
            </Box>
          );
        })}
      </Box>

      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex alignItems="center">
          <Text mr={8}>
            Showing{' '}
            <Text as="span">
              {pageIndex * 10 + 1} -{' '}
              {Math.min((pageIndex + 1) * 10, data.length)}
            </Text>{' '}
            of <Text as="span">{data.length}</Text>
          </Text>
        </Flex>
        <Flex>
          <Tooltip label="Previous Page">
            <IconButton
              variant="ghost"
              aria-label="Previous Page"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<BsChevronLeft />}
            />
          </Tooltip>
          <Tooltip label="First Page">
            <Button
              variant="ghost"
              aria-label="First Page"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              mr={4}
            >
              1
            </Button>
          </Tooltip>
          <Text mr={8} color="#858585" fontSize="16px" alignSelf="bottom">
            {' '}
            ...{' '}
          </Text>
          <Tooltip label="Last Page">
            <Button
              variant="ghost"
              aria-label="Last Page"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              mr={4}
            >
              {pageCount}
            </Button>
          </Tooltip>
          <Tooltip label="Next Page">
            <IconButton
              variant="ghost"
              aria-label="Next Page"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<BsChevronRight />}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
}
