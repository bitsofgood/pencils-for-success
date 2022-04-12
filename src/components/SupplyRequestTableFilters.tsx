import {
  Button,
  Box,
  Input,
  Popover,
  PopoverTrigger,
  PopoverBody,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  PopoverContent,
  PopoverArrow,
  Stack,
  HStack,
  Select,
  Text,
} from '@chakra-ui/react';

import { BsFilter } from 'react-icons/bs';
import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  ReactElement,
} from 'react';
import {
  FilterProps,
  FilterValue,
  IdType,
  Row,
  Filters,
  ColumnInstance,
} from 'react-table';
import { matchSorter } from 'match-sorter';
import { DetailedSupplyRequest } from '@/pages/api/recipients/[recId]/supply-requests';

const getMinMax = (
  rows: Row<DetailedSupplyRequest>[],
  id: IdType<DetailedSupplyRequest>,
) => {
  let min = rows.length ? rows[0].values[id] : 0;
  let max = rows.length ? rows[0].values[id] : 0;
  rows.forEach((row) => {
    min = Math.min(row.values[id], min);
    max = Math.max(row.values[id], max);
  });
  return [min, max];
};

const useActiveElement = () => {
  const [active, setActive] = useState(document.activeElement);

  const handleFocusIn = () => {
    setActive(document.activeElement);
  };

  useEffect(() => {
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return active;
};

export function DefaultColumnFilter({
  column: { filterValue, render, setFilter, preFilteredRows, id },
}: FilterProps<DetailedSupplyRequest>) {
  const count = preFilteredRows.length;

  return (
    <>
      <Text> {render('Header')}</Text>
      <Input
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    </>
  );
}

export function SelectColumnFilter({
  column: { filterValue, render, setFilter, preFilteredRows, id },
}: FilterProps<DetailedSupplyRequest>) {
  const options = useMemo(() => {
    const opts = new Set<any>();
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id]);
    });
    return [...Array.from(opts.values())];
  }, [id, preFilteredRows]);

  return (
    <>
      <Text>{render('Header')}</Text>
      <Select
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value=""> All </option>
        {options.map((option, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </>
  );
}

export function NumberRangeColumnFilter({
  column: { filterValue = [], render, preFilteredRows, setFilter, id },
}: FilterProps<DetailedSupplyRequest>) {
  const [min, max] = React.useMemo(
    () => getMinMax(preFilteredRows, id),
    [id, preFilteredRows],
  );

  const focusedElement = useActiveElement();
  const hasFocus =
    focusedElement &&
    (focusedElement.id === `${id}_1` || focusedElement.id === `${id}_2`);
  return (
    <>
      <Text>{render('Header')}</Text>
      <HStack
        style={{
          display: 'flex',
          alignItems: 'baseline',
          paddingTop: 5,
        }}
      >
        <NumberInput
          id={`${id}_1`}
          onChange={(value) => {
            const val = value;
            setFilter((old: any[] = []) => [
              val ? parseInt(val, 10) : undefined,
              old[1],
            ]);
          }}
          size="sm"
          min={min}
          max={max}
        >
          <NumberInputField placeholder={`Min (${min})`} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Text> to </Text>

        <NumberInput
          id={`${id}_2`}
          onChange={(value) => {
            const val = value;
            setFilter((old: any[] = []) => [
              old[0],
              val ? parseInt(val, 10) : undefined,
            ]);
          }}
          size="sm"
          min={min}
          max={max}
        >
          <NumberInputField placeholder={`Max (${max})`} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </>
  );
}

export function fuzzyTextFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: Array<IdType<T>>,
  filterValue: FilterValue,
): Array<Row<T>> {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row<T>) => row.values[id[0]]],
  });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilter.autoRemove = (val: any) => !val;

type FilterPageProps<T extends Record<string, unknown>> = {
  columns: ColumnInstance<T>[];
  setAllFilters: (
    updater: Filters<T> | ((filters: Filters<T>) => Filters<T>),
  ) => void;
};

export function FilterMenu<T extends Record<string, unknown>>({
  columns,
  setAllFilters,
}: FilterPageProps<T>): ReactElement {
  const resetFilters = useCallback(() => {
    setAllFilters([]);
  }, [setAllFilters]);

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          aria-label="Filters"
          icon={<BsFilter />}
          _focus={{
            outline: 'none',
            boxShadow: 'none',
          }}
        />
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverArrow />
        <PopoverBody boxSize="md" h="auto">
          <Stack p="5%">
            <HStack justifyContent="space-between">
              <Text> Filters </Text>
              <Button variant="outline" onClick={resetFilters}>
                {' '}
                Reset{' '}
              </Button>
            </HStack>
            <Box>
              {columns
                .filter((res) => res.canFilter)
                .map((column) => (
                  <Box mb="5%" key={column.id}>
                    {column.render('Filter')}
                  </Box>
                ))}
            </Box>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
