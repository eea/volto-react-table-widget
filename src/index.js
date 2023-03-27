import { Input } from 'semantic-ui-react';
import DatetimeWidget from '@plone/volto/components/manage/Widgets/DatetimeWidget';
import { map } from 'lodash';

import ReactTableWidget from './components/Widgets/ReactTableWidget';
import {
  ClearIndicator,
  DropdownIndicator,
  MenuList,
  Option,
  customSelectStyles,
  selectTheme,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
export { ReactTableWidget };

const applyConfig = (config) => {
  config.settings.reactTableWidgets = [
    {
      condition: (schema) => {
        return schema.choices;
      },
      fieldSchema: (schema, extras) => {
        const { Select } = extras;
        const options = [
          ...map(schema.choices, (option) => ({
            value: option[0],
            label:
              // Fix "None" on the serializer, to remove when fixed in p.restapi
              option[1] !== 'None' && option[1] ? option[1] : option[0],
          })),
        ];
        return {
          Field: Select,
          type: 'select',
          properties: {
            id: `field-${schema.id}`,
            options: options,
            className: 'react-table-select-field',
            styles: customSelectStyles,
            theme: selectTheme,
            isMulti: schema.isMulti,
            components: {
              ...(schema.choices?.length > 25 && {
                MenuList,
              }),
              DropdownIndicator,
              ClearIndicator,
              Option: Option,
            },
          },
        };
      },
    },
    {
      condition: (schema) => {
        return schema.type === 'number';
      },
      fieldSchema: (schema, extras) => {
        return {
          Field: Input,
          type: 'number',
          properties: {
            id: `field-${schema.id}`,
            type: 'number',
            className: 'react-table-integer-field',
            min: schema.minimum,
            max: schema.maximum,
          },
        };
      },
    },
    {
      condition: (schema) => {
        return schema.type === 'date';
      },
      fieldSchema: (schema, extras) => {
        return {
          Field: DatetimeWidget,
          type: 'date',
          properties: {
            id: `field-${schema.id}`,
            title: schema.title,
          },
        };
      },
    },
  ];
  return config;
};

export default applyConfig;
