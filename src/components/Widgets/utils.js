import { Input } from 'semantic-ui-react';
import DatetimeWidget from '@plone/volto/components/manage/Widgets/DatetimeWidget';
import { map } from 'lodash';
import {
  ClearIndicator,
  DropdownIndicator,
  MenuList,
  Option,
  customSelectStyles,
  selectTheme,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

export const getFieldType = (fieldSchema, reactSelect) => {
  const Select = reactSelect.default;
  const { title, type, choices, id, minimum, maximum, isMulti } = fieldSchema;
  let fieldType = {
    properties: {},
    Field: Input,
  };
  if (choices) {
    const options = [
      ...map(choices, (option) => ({
        value: option[0],
        label:
          // Fix "None" on the serializer, to remove when fixed in p.restapi
          option[1] !== 'None' && option[1] ? option[1] : option[0],
      })),
    ];
    return {
      ...fieldType,
      Field: Select,
      type: 'select',
      properties: {
        options: options,
        id: `field-${id}`,
        className: 'react-table-select-field',
        styles: customSelectStyles,
        theme: selectTheme,
        isMulti: isMulti,
        components: {
          ...(choices?.length > 25 && {
            MenuList,
          }),
          DropdownIndicator,
          ClearIndicator,
          Option: Option,
        },
      },
    };
  }
  if (type === 'number') {
    return {
      ...fieldType,
      type: 'number',
      Field: Input,
      properties: {
        id: `field-${id}`,
        type: 'number',
        className: 'react-table-integer-field',
        min: minimum,
        max: maximum,
      },
    };
  }
  if (type === 'date') {
    return {
      ...fieldType,
      type: 'date',
      Field: DatetimeWidget,
      properties: {
        id: `field-${id}`,
        title: title,
      },
    };
  }
  return {
    ...fieldType,
    type: 'string',
    Field: Input,
    properties: {
      id: `field-${id}`,
      type: 'text',
      className: 'react-table-text-field',
      fluid: true,
    },
  };
};

export const getOnChange = (type, setValue) => {
  switch (type) {
    case 'select':
      return (args) => {
        if (!args.isMulti) {
          setValue(args[0].value);
        } else {
          setValue(args[0].map((value) => value.value));
        }
      };
    case 'number':
      return (args) => setValue(args[0].target.value);
    case 'date':
      return (args) => setValue(args[1]);
    case 'string':
      return (args) => setValue(args[0].target.value);
    default:
      return (args) => setValue(args[0].target.value);
  }
};

export const getValue = (type, value, defaultValue, normalizedValue) => {
  switch (type) {
    case 'select':
      return normalizedValue;
    case 'number':
      return value ?? defaultValue;
    case 'date':
      return value ?? defaultValue;
    case 'string':
      return value ?? defaultValue;
    default:
      return value ?? defaultValue;
  }
};

export const getValueToRender = (fieldType, value, moment) => {
  const defaultValue = value || <>&nbsp;</>;
  switch (fieldType.type) {
    case 'select':
      return fieldType.properties.isMulti && Array.isArray(value)
        ? value.join(', ')
        : defaultValue;
    case 'number':
      return defaultValue;
    case 'date':
      return value ? moment(value).format('LLL') : defaultValue;
    case 'string':
      return defaultValue;
    default:
      return fieldType.type;
  }
};
