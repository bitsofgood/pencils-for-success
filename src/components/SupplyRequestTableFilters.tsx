import {
  Button,
  MenuItem,
  Input,
  Popover,
  PopoverTrigger,
  PopoverBody,
  IconButton,
  PopoverContent,
  PopoverArrow,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';
import React, { useCallback, useContext, ReactElement } from 'react';
import {
  FilterProps,
  FilterValue,
  IdType,
  Row,
  TableInstance,
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
  const [active, setActive] = React.useState(document.activeElement);

  const handleFocusIn = () => {
    setActive(document.activeElement);
  };

  React.useEffect(() => {
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return active;
};

export function SelectColumnFilter({
  column: { filterValue, render, setFilter, preFilteredRows, id },
}: FilterProps<DetailedSupplyRequest>) {
  const options = React.useMemo(() => {
    const opts = new Set<any>();
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id]);
    });
    return [...Array.from(opts.values())];
  }, [id, preFilteredRows]);

  return (
    <Input
      select
      type="text"
      label={render('Header')}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <MenuItem value="">All</MenuItem>
      {options.map((option, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </Input>
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
      {/* <Text htmlFor={id} shrink focused={!!hasFocus}>
        {render('Header')}
      </Text> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: 5,
        }}
      >
        <Input
          id={`${id}_1`}
          value={filterValue[0] || ''}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old: any[] = []) => [
              val ? parseInt(val, 10) : undefined,
              old[1],
            ]);
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '70px',
            marginRight: '0.5rem',
          }}
        />
        to
        <Input
          id={`${id}_2`}
          value={filterValue[1] || ''}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old: any[] = []) => [
              old[0],
              val ? parseInt(val, 10) : undefined,
            ]);
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '70px',
            marginLeft: '0.5rem',
          }}
        />
      </div>
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
  instance: TableInstance<T>;
  anchorEl?: Element;
  onClose: () => void;
  show: boolean;
};

export function FilterMenu<T extends Record<string, unknown>>({
  instance,
  anchorEl,
  onClose,
  show,
}: FilterPageProps<T>): ReactElement {
  const { allColumns, setAllFilters } = instance;

  const resetFilters = useCallback(() => {
    setAllFilters([]);
  }, [setAllFilters]);

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          aria-label="Edit Supply Request"
          icon={<BsFilter />}
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
            <Heading>Helllloooo</Heading>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

// export function FilterPage<T extends Record<string, unknown>>({
//   instance,
//   anchorEl,
//   onClose,
//   show,
// }: FilterPageProps<T>): ReactElement {
//   const classes = useStyles({});
//   const { allColumns, setAllFilters } = instance;

//   const onSubmit = useCallback(
//     (e: FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       onClose();
//     },
//     [onClose],
//   );

//   const resetFilters = useCallback(() => {
//     setAllFilters([]);
//   }, [setAllFilters]);

//   return (
//     <div>
//       <Popover
//         anchorEl={anchorEl}
//         id="popover-filters"
//         onClose={onClose}
//         open={show}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <div className={classes.columnsPopOver}>
//           <Typography className={classes.popoverTitle}>Filters</Typography>
//           <form onSubmit={onSubmit}>
//             <Button
//               className={classes.filtersResetButton}
//               color="primary"
//               onClick={resetFilters}
//             >
//               Reset
//             </Button>
//             <div className={classes.grid}>
//               {allColumns
//                 .filter((it) => it.canFilter)
//                 .map((column) => (
//                   <div key={column.id} className={classes.cell}>
//                     {column.render('Filter')}
//                   </div>
//                 ))}
//             </div>
//             <Button className={classes.hidden} type="submit">
//               &nbsp;
//             </Button>
//           </form>
//         </div>
//       </Popover>
//     </div>
//   );
// }
