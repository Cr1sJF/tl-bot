import { KeyValueObj, IConvertToLabelValueOptions, LabelValueObj } from "../types";

export const convertToLabelValueArray = <T extends KeyValueObj>(
  source: T[],
  lblKey: keyof T,
  valKey: keyof T,
  options: Partial<IConvertToLabelValueOptions> = {}
) => {
  let result: LabelValueObj[] = [];

  if (options.sort) {
    source.sort(function (a: T, b: T) {
      var x = !isNaN(Number(a[lblKey])) ? Number(a[lblKey]) : a[lblKey];
      var y = !isNaN(Number(a[lblKey])) ? Number(b[lblKey]) : b[lblKey];
      if (typeof x == 'number' && typeof y == 'number') {
        return x < y ? -1 : x > y ? 1 : 0;
      } else if (typeof x == 'string' && typeof y == 'string') {
        return y.toString().localeCompare(x);
      } else {
        return String(x).localeCompare(String(y));
      }
    });
  }

  source.forEach((elem: T) => {
    let formatted: LabelValueObj = {
      label: elem[lblKey],
      value: elem[valKey],
    };

    if (options.upper) {
      formatted = {
        label: formatted.label.toString().toUpperCase(),
        value: formatted.value.toString().toUpperCase(),
      };
    }
    result.push(formatted);
  });

  return result;
};

export const sortJsonByField = (jsonArray: any[], field: string) => {
  jsonArray.sort(function (a, b) {
    a = typeof a == 'function' ? a() : a;
    b = typeof b == 'function' ? b() : b;
    a = typeof a[field] == 'string' ? a[field].toLowerCase() : a[field];
    b = typeof b[field] == 'string' ? b[field].toLowerCase() : b[field];

    return a < b ? -1 : a > b ? 1 : 0;
  });

  return jsonArray;
};
