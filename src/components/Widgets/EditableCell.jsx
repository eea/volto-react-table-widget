import { useSelector } from 'react-redux';
import React from 'react';
import { normalizeValue } from '@plone/volto/components/manage/Widgets/SelectUtils';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { getFieldType, getOnChange, getValue, getValueToRender } from './utils';

export const EditableCell = ({
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
  const locale = useSelector((state) => state.intl.locale);
  moment.locale(locale);

  const [value, setValue] = React.useState(initialValue);

  const onBlur = () => {
    updateCell(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const { choices, defaultValue, isMulti } = fieldSchema;
  const intl = useIntl();
  const fieldType = getFieldType(fieldSchema, reactSelect);
  const Field = fieldType.Field;
  const normalizedValue = normalizeValue(choices, value, intl);
  const onChangeFunction = getOnChange(fieldType.type, setValue);
  return selectedRow === index ? (
    <Field
      {...fieldType.properties}
      value={getValue(fieldType.type, value, defaultValue, normalizedValue)}
      onChange={(...args) => onChangeFunction({ ...args, isMulti: isMulti })}
      onBlur={onBlur}
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
      {getValueToRender(fieldType, value, moment)}
    </span>
  );
};
