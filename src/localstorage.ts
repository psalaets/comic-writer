const db = window.localStorage;

export default {
  get(key: string) {
    return new Promise<any>((resolve, reject) => {
      const value = db.getItem(key);

      if (value != null) {
        resolve(JSON.parse(value));
      } else {
        resolve(null);
      }
    });
  },
  set(key: string, value: any) {
    return new Promise<undefined>((resolve, reject) => {
      db.setItem(key, JSON.stringify(value));
      resolve();
    });
  }
};
