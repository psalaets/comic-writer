const db = window.localStorage;

export default {
  get(key) {
    return new Promise((resolve, reject) => {
      const value = db.getItem(key);
      return JSON.parse(value);
    });
  },
  set(key, value) {
    return new Promise((resolve, reject) => {
      const storable = value != null ? JSON.stringify(value) : null;
      return db.setItem(key, storable);
    });
  }
};