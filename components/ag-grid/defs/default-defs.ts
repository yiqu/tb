import { ColDef } from 'ag-grid-community';

export const tableDefs: ColDef<any>[] = [
  {
    field: 'name',
    sort: 'desc',
    width: 140,
    //valueFormatter: nameFormatter,
    tooltipField: 'name',
    headerName: 'Poke Name',
    headerTooltip: 'Pokemon Name',
    minWidth: 100,
  },
  {
    field: 'age',
    //cellRenderer: ageRenderer,
  },
];
