import {
  ClearIndicator,
  DropdownIndicator,
  MenuList,
  Option,
  customSelectStyles,
  selectTheme,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { Input, Pagination, Table } from 'semantic-ui-react';
import { usePagination, useTable } from 'react-table';

import { Icon } from '@plone/volto/components';
import React from 'react';
import { compose } from 'redux';
import deleteSVG from '@plone/volto/icons/delete.svg';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { map } from 'lodash';
import { normalizeValue } from '@plone/volto/components/manage/Widgets/SelectUtils';
import paginationLeftSVG from '@plone/volto/icons/left-key.svg';
import paginationRightSVG from '@plone/volto/icons/right-key.svg';
import plusSVG from '@plone/volto/icons/circle-plus.svg';
import { useIntl } from 'react-intl';

const FieldEditor = (props) => {
  const {
    fieldSchema,
    value,
    onChange,
    onChangeSelect,
    onBlur,
    reactSelect,
  } = props;
  const Select = reactSelect.default;

  const {
    type,
    choices,
    id,
    minimum,
    maximum,
    defaultValue,
    isMulti,
  } = fieldSchema;
  const intl = useIntl();
  const normalizedValue = normalizeValue(choices, value, intl);
  if (choices) {
    const options = [
      ...map(choices, (option) => ({
        value: option[0],
        label:
          // Fix "None" on the serializer, to remove when fixed in p.restapi
          option[1] !== 'None' && option[1] ? option[1] : option[0],
      })),
    ];
    return (
      <Select
        id={`field-${id}`}
        value={normalizedValue}
        className="react-table-select-field"
        theme={selectTheme}
        isMulti={isMulti}
        components={{
          ...(choices?.length > 25 && {
            MenuList,
          }),
          DropdownIndicator,
          ClearIndicator,
          Option: Option,
        }}
        options={options}
        styles={customSelectStyles}
        onChange={(e) => onChangeSelect(e, isMulti)}
        onBlur={onBlur}
      />
    );
  }
  if (type === 'number') {
    return (
      <Input
        id={`field-${id}`}
        className="react-table-integer-field"
        type="number"
        min={minimum || null}
        max={maximum || null}
        value={value || defaultValue}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  }
  return (
    <Input
      id={`field-${id}`}
      type="text"
      className="react-table-text-field"
      fluid
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateCell, // This is a custom function that we supplied to our table instance
  selectedRow,
  setSelectedRow,
  schema,
  reactSelect,
  state: { pageIndex, pageSize },
}) => {
  const fieldSchema = { ...schema?.properties?.[id], id: id };
  const [value, setValue] = React.useState(initialValue);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onChangeSelect = (e, isMulti) => {
    if (!isMulti) {
      setValue(e.value);
    } else {
      setValue(e.map((value) => value.value));
    }
  };

  const onBlur = () => {
    updateCell(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return selectedRow === index ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <FieldEditor
      fieldSchema={fieldSchema}
      value={value}
      onChange={onChange}
      onChangeSelect={onChangeSelect}
      onBlur={onBlur}
      reactSelect={reactSelect}
    />
  ) : (
    <span
      role="button"
      className="editable-cell"
      tabIndex={0}
      onClick={() => {
        setSelectedRow(index);
      }}
      onKeyDown={() => {
        setSelectedRow(index);
      }}
      onFocus={() => {
        setSelectedRow(index);
      }}
    >
      {!fieldSchema.isMulti ? (
        value || <>&nbsp;</>
      ) : value ? (
        value.join(', ')
      ) : (
        <>&nbsp;</>
      )}
    </span>
  );
};

const defaultColumn = {
  Cell: EditableCell,
};

function EditableTable(props) {
  const {
    columns,
    data,
    updateCell,
    removeRow,
    addRowAfter,
    selectedRow,
    setSelectedRow,
    schema,
    reactSelect,
  } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateCell,
      selectedRow,
      setSelectedRow,
      schema,
      reactSelect,
    },
    usePagination,
  );
  if (data.length === 0) {
    addRowAfter({ key: 'Enter' }, 0, pageIndex, pageSize);
  }
  React.useEffect(() => {
    gotoPage(pageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // Render the UI for your table
  return (
    <>
      <Table celled {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup, key) => (
            <Table.Row key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Table.HeaderCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </Table.HeaderCell>
              ))}
              <Table.HeaderCell>{'Actions'}</Table.HeaderCell>
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Table.Row
                className={
                  selectedRow === pageIndex * pageSize + i ? 'selected-row' : ''
                }
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    <Table.Cell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </Table.Cell>
                  );
                })}
                <Table.Cell>
                  <div className={'row-actions'}>
                    <span
                      onClick={(e) => {
                        addRowAfter(e, i, pageIndex, pageSize);
                      }}
                      onKeyDown={(e) => {
                        addRowAfter(e, i, pageIndex, pageSize);
                      }}
                      tabIndex={0}
                      role="button"
                      className="row-action"
                    >
                      <Icon name={plusSVG} size="23px" />
                    </span>
                    <span
                      onClick={(e) => removeRow(e, i, pageIndex, pageSize)}
                      onKeyDown={(e) => removeRow(e, i, pageIndex, pageSize)}
                      tabIndex={0}
                      role="button"
                      className="row-action"
                    >
                      <Icon name={deleteSVG} size="23px" color="red" />
                    </span>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <div className="pagination-wrapper react-table-pagination">
        <Pagination
          activePage={pageIndex + 1}
          totalPages={pageCount}
          onPageChange={(e, { activePage }) => {
            gotoPage(activePage - 1);
          }}
          firstItem={null}
          lastItem={null}
          prevItem={{
            content: <Icon name={paginationLeftSVG} size="18px" />,
            icon: true,
            'aria-disabled': pageIndex + 1 === 1,
            className: pageIndex + 1 === 1 ? 'disabled' : null,
          }}
          nextItem={{
            content: <Icon name={paginationRightSVG} size="18px" />,
            icon: true,
            'aria-disabled': pageIndex + 1 === pageCount,
            className: pageIndex + 1 === pageCount ? 'disabled' : null,
          }}
        ></Pagination>
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select
          style={{ maxWidth: '7rem' }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default compose(injectLazyLibs(['reactSelect']))(EditableTable);
