const db = window.localStorage;

export default {
  get<ValueType>(key: string): Promise<ValueType | null> {
    return new Promise<any>((resolve, reject) => {
      const value = db.getItem(key);

      if (value != null) {
        resolve(JSON.parse(value));
      } else {
        resolve(null);
      }
    });
  },
  set<ValueType>(key: string, value: ValueType) {
    return new Promise<void>((resolve, reject) => {
      db.setItem(key, JSON.stringify(value));
      resolve();
    });
  }
};
