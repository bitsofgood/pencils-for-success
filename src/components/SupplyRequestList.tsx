/* eslint-disable react/jsx-key */
import { useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Text,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { useTable, usePagination, Column } from 'react-table';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { DetailedSupplyRequest } from '@/pages/api/recipients/[recId]/supply-requests';

interface SupplyRequestListProps {
  data: DetailedSupplyRequest[];
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
      <Table bordercollapse="collapse" borderSpacing="0 100px">
        <Thead
          textColor="#858585"
          borderRadius="8px"
          backgroundColor="#F0F0F0"
          borderStyle="unset"
        >
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Tr borderRadius="12px" border="2px solid #AEAEAE">
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

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