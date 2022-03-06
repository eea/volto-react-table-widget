import React from 'react';
import { useTable, usePagination } from 'react-table';
import { useCSVReader, useCSVDownloader } from 'react-papaparse';
import { Toast } from '@plone/volto/components';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  template: {
    id: 'Variation',
    defaultMessage: 'Variation',
  },
  csv_file_imported_correctly: {
    id: 'CSV file imported correctly',
    defaultMessage: 'CSV file imported correctly',
  },
  import_new_imported_item_count: {
    id: 'Imported item count',
    defaultMessage: '{count} new items imported',
  },
  import_modified_item_count: {
    id: 'Modified item count',
    defaultMessage: '{count} items modified',
  },
  import_csv_file: {
    id: 'Import CSV file',
    defaultMessage: 'Import CSV file',
  },
});

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

const defaultColumn = {
  Cell: EditableCell,
};

// Be sure to pass our updateMyData and the skipPageReset option
function Table({ columns, data, updateMyData, skipPageReset }) {
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    usePagination,
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function ReactDataTableWidget(props) {
  // Set our editable cell renderer as the default Cell renderer
  let { columns, items, csvexport, csvimport } = props;

  const intl = useIntl();
  const tablecolumns = React.useMemo(() => columns, [columns]);

  const [data, setData] = React.useState(() => items);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      }),
    );

    // return items back to the component
    items = items.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...items[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    });
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData);

  const csvcolumns = tablecolumns[0].columns.map((d) => {
    return {
      label: d.accessor,
      key: d.accessor,
    };
  });

  csvcolumns.push({
    label: '@id',
    key: '@id',
  });

  const { CSVReader } = useCSVReader();
  const { CSVDownloader, Type } = useCSVDownloader();
  return (
    <>
      <button onClick={resetData}>Reset Data</button>
      {csvexport && (
        <CSVDownloader
          type={Type.Button}
          filename={'prepackaged-files.csv'}
          config={{
            delimiter: ';',
            quoteChar: '"',
          }}
          data={data}
        >
          Download as CSV file
        </CSVDownloader>
      )}

      {csvimport && (
        <CSVReader
          onUploadAccepted={(results) => {
            let newdatacount = 0;

            let newdata = results.data.map((item) => {
              if (!item['@id']) {
                newdatacount += 1;
                return {
                  ...item,
                  '@id': uuid(),
                };
              }
              return item;
            });

            let modifiedcount = newdata.length - newdatacount;

            setData(newdata);
            props.value.items = newdata;
            toast.success(
              <Toast
                success
                autoClose={5000}
                content={
                  (intl.formatMessage(messages.csv_file_imported_correctly) +
                    ' ',
                  +intl.formatMessage(messages.import_new_imported_item_count, {
                    count: newdatacount,
                  }) + ' ',
                  +intl.formatMessage(messages.import_modified_item_count, {
                    count: modifiedcount,
                  }))
                }
              />,
            );
          }}
          config={{ header: true }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }) => (
            <>
              <div>
                <button type="button" {...getRootProps()}>
                  intl.formatMessage(messages.import_csv_file)
                </button>
                <div>{acceptedFile && acceptedFile.name}</div>
                <button {...getRemoveFileProps()}>Remove</button>
              </div>
              <ProgressBar />
            </>
          )}
        </CSVReader>
      )}

      <Table
        columns={tablecolumns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </>
  );
}

export default ReactDataTableWidget;
