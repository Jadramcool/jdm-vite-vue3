export const clone = (obj: Record<string, any>): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (Array.isArray(obj)) {
    return obj.map(clone);
  }

  const clonedObj: { [key: string]: any } = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    clonedObj[key] = clone(obj[key]);
  }

  return clonedObj;
};

// 处理手机号mask
export const maskPhone = (phone: string | undefined): string => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 展平对象key
export const flattenObject = (
  obj: any,
  parentKey: string = '',
  result: { [key: string]: any } = {},
): { [key: string]: any } => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};

/**
 * 布尔值转换工具函数
 * 用于处理后端传来的布尔值与前端表单组件值的转换
 */
export const booleanConverter = {
  /**
   * 将布尔值转换为数字（true -> 1, false -> 0）
   * @param value 布尔值
   * @returns 数字值
   */
  toNumber: (value: boolean | undefined | null): number => {
    if (value === true) return 1;
    if (value === false) return 0;
    return 0; // 默认值
  },

  /**
   * 将布尔值转换为字符串（true -> '1', false -> '0'）
   * @param value 布尔值
   * @returns 字符串值
   */
  toString: (value: boolean | undefined | null): string => {
    if (value === true) return '1';
    if (value === false) return '0';
    return '0'; // 默认值
  },

  /**
   * 将数字转换为布尔值（1 -> true, 0 -> false）
   * @param value 数字值
   * @returns 布尔值
   */
  fromNumber: (value: number | undefined | null): boolean => {
    return value === 1;
  },

  /**
   * 将字符串转换为布尔值（'1' -> true, '0' -> false）
   * @param value 字符串值
   * @returns 布尔值
   */
  fromString: (value: string | undefined | null): boolean => {
    return value === '1';
  },

  /**
   * 批量转换对象中的布尔字段为数字
   * @param obj 源对象
   * @param fields 需要转换的字段数组
   * @returns 转换后的对象
   */
  convertBooleanFieldsToNumber: (
    obj: Record<string, any>,
    fields: string[],
  ): Record<string, any> => {
    const result = { ...obj };
    fields.forEach((field) => {
      if (field in result && typeof result[field] === 'boolean') {
        result[field] = booleanConverter.toNumber(result[field]);
      }
    });
    return result;
  },

  /**
   * 批量转换对象中的数字字段为布尔值
   * @param obj 源对象
   * @param fields 需要转换的字段数组
   * @returns 转换后的对象
   */
  convertNumberFieldsToBoolean: (
    obj: Record<string, any>,
    fields: string[],
  ): Record<string, any> => {
    const result = { ...obj };
    fields.forEach((field) => {
      if (field in result && typeof result[field] === 'number') {
        result[field] = booleanConverter.fromNumber(result[field]);
      }
    });
    return result;
  },
};
