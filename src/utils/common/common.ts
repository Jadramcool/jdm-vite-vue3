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
