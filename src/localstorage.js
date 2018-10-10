const db = window.localStorage;

export default {
  get(key) {
    return new Promise((resolve, reject) => {
      const value = db.getItem(key);
      resolve(JSON.parse(value));
    });
  },
  set(key, value) {
    return new Promise((resolve, reject) => {
      const storable = value != null ? JSON.stringify(value) : null;
      resolve(db.setItem(key, storable));
    });
  }
};