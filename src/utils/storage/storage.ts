interface StorageInterface {
  setItem(key: string, value: any): void;
  getItem(key: string): any;
  removeItem(key: string): void;
  clear(): void;
  clearAll(): void;
}

class CustomStorage implements StorageInterface {
  private prefixKey: string;

  private storage: Storage;

  constructor({
    prefixKey = '',
    storage = sessionStorage,
  }: {
    prefixKey?: string;
    storage?: Storage;
  }) {
    this.prefixKey = prefixKey;
    this.storage = storage;
  }

  private getKey(key: string): string {
    return `${this.prefixKey}${key}`;
  }

  setItem(key: string, value: any): void {
    this.storage.setItem(this.getKey(key), JSON.stringify(value));
  }

  getItem(key: string): any {
    const value = this.storage.getItem(this.getKey(key));
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  removeItem(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  clear(): void {
    // 清空带有指定前缀的所有数据
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefixKey)) {
        this.storage.removeItem(key);
      }
    }
  }

  clearAll(): void {
    // 清空所有数据
    this.storage.clear();
  }
}

// 导出的函数
export function createStorage({ prefixKey = '', storage = sessionStorage }) {
  return new CustomStorage({ prefixKey, storage });
}
