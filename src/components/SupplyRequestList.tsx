/* eslint-disable react/jsx-key */
import { useMemo, useContext } from 'react';

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
  Icon,
} from '@chakra-ui/react';
import { useTable, usePagination, useSortBy, Column } from 'react-table';
import {
  BsThreeDots,
  BsChevronLeft,
  BsChevronRight,
  BsChevronUp,
  BsChevronDown,
  BsPencilFill,
  BsTrashFill,
  BsCaretDownFill,
} from 'react-icons/bs';
import useSWR, { mutate } from 'swr';
import { SupplyRequestStatus } from '@prisma/client';
import {
  DetailedSupplyRequest,
  GetSupplyRequestsResponse,
} from '@/pages/api/recipients/[recId]/supply-requests';
import {
  SupplyRequestModalContext,
  ModalState,
} from '@/providers/SupplyRequestModalProvider';
import { ErrorResponse } from '@/utils/error';

const updateSupplyRequestStatus = async (
  supplyId: number,
  recId: number,
  updatedSupplyRequest: any,
) => {
  const response = await fetch(
    `/api/recipients/${recId}/supply-requests/${supplyId}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        updatedSupplyRequest: {
          status: updatedSupplyRequest.status,
        },
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

  mutate(`/api/recipients/${recId}/supply-requests`);

  return responseJson;
};

interface SupplyRequestListProps {
  recipientId: number;
}

function RowContextMenu(requestId: number, recipientId: number) {
  const {
    onOpen,
    setModalState,
    setActiveSupplyRequestId,
    setActiveRecipientId,
  } = useContext(SupplyRequestModalContext);

  const onDeleteSupplyRequest = () => {
    setActiveRecipientId(recipientId);
    setActiveSupplyRequestId(requestId);
    setModalState(ModalState.DeleteSupplyRequest);
    onOpen();
  };
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          aria-label="Supply Request Actions"
          icon={<BsThreeDots />}
          _focus={{
            outline: 'none',
            boxShadow: 'none',
          }}
        />
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverArrow />
        <PopoverBody width="auto">
          <Stack>
            <Button
              fontWeight="normal"
              variant="ghost"
              color="red"
              alignItems="center"
              justifyContent="flex-start"
              onClick={onDeleteSupplyRequest}
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
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          variant="ghost"
          display="flex"
          alignItems="center"
          cursor="pointer"
          fontWeight="normal"
          _focus={{
            outline: 'none',
            boxShadow: 'none',
          }}
          onClick={() => {
            // setIsOpen(true);
          }}
        >
          <BsCaretDownFill />
          <Text marginLeft={1.5}>Notes</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="auto"
        onBlur={() => {
          // setIsOpen(false);
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

function StatusContextMenu(supplyRequest: any) {
  const { status } = supplyRequest;
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
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
          _active={{
            backgroundColor: status === 'PENDING' ? '#FFF0CC' : '#C7E4FF',
          }}
          _focus={{
            outline: 'none',
            boxShadow: 'none',
          }}
          transitionDuration="0.2s"
          onClick={() => {
            // setFocused(true);
          }}
        >
          <Box marginRight={2}>
            <BsCaretDownFill
              style={{
                // transform: `${focused ? 'rotate(180deg)' : 'rotate(0deg)'}`,
                transition: 'all 0.2s',
              }}
            />
          </Box>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="auto"
        onBlur={() => {
          // setFocused(false);
        }}
      >
        <PopoverBody width="auto">
          <Box
            backgroundColor="#FFF8E7"
            color="#CA9000"
            paddingLeft="3"
            paddingRight="3"
            paddingTop="2"
            paddingBottom="2"
            fontWeight="bold"
            borderRadius="8"
            cursor="pointer"
            marginBottom={2}
            textAlign="center"
            onClick={() =>
              updateSupplyRequestStatus(
                supplyRequest.id,
                supplyRequest.recipientId,
                {
                  ...supplyRequest,
                  status: SupplyRequestStatus.PENDING,
                },
              )
            }
            _hover={{
              backgroundColor: '#FFF0CC',
            }}
            transitionDuration="0.2s"
          >
            Pending
          </Box>
          <Box
            backgroundColor="#E0F0FF"
            color="#0A5093"
            paddingLeft="3"
            paddingRight="3"
            paddingTop="2"
            paddingBottom="2"
            fontWeight="bold"
            borderRadius="8"
            textAlign="center"
            cursor="pointer"
            onClick={() =>
              updateSupplyRequestStatus(
                supplyRequest.id,
                supplyRequest.recipientId,
                {
                  ...supplyRequest,
                  status: SupplyRequestStatus.COMPLETE,
                },
              )
            }
            _hover={{
              backgroundColor: '#C7E4FF',
            }}
            transitionDuration="0.2s"
          >
            Complete
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

// renders a cell
function Cell(cell: any) {
  const cellInfo = cell;
  // render status cell
  if (cellInfo.column.Header === 'Status') {
    return StatusContextMenu(cellInfo.row.original);
  }
  // render date cells
  if (
    cellInfo.column.Header === 'Last Updated' ||
    cellInfo.column.Header === 'Created'
  ) {
    const fullDate = cell.value.substring(0, 10);
    const year = fullDate.substring(0, 4);
    const month = fullDate.substring(5, 7);
    const day = fullDate.substring(8, 10);
    return `${month}/${day}/${year}`;
  }
  if (cellInfo.column.Header === 'Notes') {
    if (cell.value === '') {
      return <></>;
    }
    return NotesContextMenu(cell.value);
  }
  // render default cells

  return cellInfo.render('Cell');
}

export default function SupplyRequestList({
  recipientId,
}: SupplyRequestListProps) {
  const { data, error } = useSWR<GetSupplyRequestsResponse>(
    `/api/recipients/${recipientId}/supply-requests`,
  );

  const tableData = useMemo(() => data?.items || [], [data?.items]);

  const columns = useMemo<Column<DetailedSupplyRequest>[]>(
    () => [
      {
        Header: 'Item Name',
        accessor: (row) => row.item.name,
        disableSortBy: true,
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
        disableSortBy: true,
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
      data: tableData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: 'id', desc: true }],
      },
    },
    useSortBy,
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
            paddingTop={3}
            paddingBottom={3}
            paddingLeft={6}
            paddingRight={6}
            marginBottom={4}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column, index) => (
              <Box
                fontSize="16px"
                fontWeight="bold"
                width={columnWidths[index]}
                marginLeft={1}
                marginRight={1}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                {column.isSorted && (
                  <IconButton
                    variant="ghost"
                    aria-label="Previous Page"
                    w={5}
                    h={5}
                    icon={
                      column.isSortedDesc ? <BsChevronDown /> : <BsChevronUp />
                    }
                  />
                )}
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

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        height="60vh"
        overflowY="scroll"
      >
        {page.map((row) => {
          prepareRow(row);
          return (
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              border="1.5px solid rgba(0, 0, 0, 0.1)"
              borderRadius="8px"
              paddingTop={2}
              paddingBottom={2}
              paddingLeft={6}
              paddingRight={6}
              marginBottom={4}
              key={row.original.id}
            >
              {row.cells.map((cell, index) => (
                <Box
                  display="flex"
                  fontSize="16px"
                  width={columnWidths[index]}
                  alignItems="center"
                  marginLeft={1}
                  marginRight={1}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  {...cell.getCellProps()}
                >
                  {Cell(cell)}
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
                cursor="pointer"
              >
                {RowContextMenu(row.original.id, row.original.recipientId)}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Flex
        justifyContent="space-between"
        pt={2}
        pb={0}
        alignItems="center"
        borderTop="1.5px solid rgba(0, 0, 0, 0.1)"
      >
        <Flex alignItems="center">
          <Text mr={8}>
            Showing{' '}
            <Text as="span">
              {pageIndex * 10 + 1} -{' '}
              {Math.min((pageIndex + 1) * 10, tableData.length)}
            </Text>{' '}
            of <Text as="span">{tableData.length}</Text>
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
