import { Input } from 'semantic-ui-react';

import config from '@plone/volto/registry';
export const getFieldType = (fieldSchema, reactSelect) => {
  const Select = reactSelect.default;
  const { id } = fieldSchema;
  const widgets = config.settings.reactTableWidgets
    .map((widget) => {
      if (widget.condition(fieldSchema)) {
        return widget.fieldSchema(fieldSchema, { Select });
      }
    })
    .filter((rtw) => rtw?.properties);
  if (widgets.length > 0) {
    return widgets[0];
  }
  return {
    Field: Input,
    type: 'string',
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
