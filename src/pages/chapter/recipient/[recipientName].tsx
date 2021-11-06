/* eslint-disable react/jsx-key */
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useTable, usePagination, ColumnWithLooseAccessor } from 'react-table';
import React from 'react';

interface RecipientMapPageProps {
  recipientName: string;
}

interface IStaticPropsContextParams {
  params: {
    recipientName: string;
  };
}

interface CustomTableProps {
  columns: ColumnWithLooseAccessor[];
  data: any[];
}

function CustomTable({ columns, data }: CustomTableProps) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
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
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="Previous Page"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
        <Flex alignItems="center">
          <Text mr={8}>
            Page{' '}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              aria-label="Next Page"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
}

export default function RecipientMapPage({
  recipientName,
}: RecipientMapPageProps) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Item Name',
        accessor: 'itemName',
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
        accessor: 'notes',
      },
    ],
    [],
  );
  const data = React.useMemo(
    () => [
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
    ],
    [],
  );
  return (
    <Box borderWidth="1px" borderRadius="lg">
      <Heading>{recipientName}</Heading>
      <Heading>Supply Requests</Heading>
      <CustomTable columns={columns} data={data} />;
    </Box>
  );
}

export async function getStaticPaths() {
  // TODO: Retrieve the data from the database
  const recipients = ['1', '2', '3'];

  const paths = recipients.map((recipientName) => ({
    params: { recipientName },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: IStaticPropsContextParams) {
  const { recipientName } = params;

  return { props: { recipientName } };
}
