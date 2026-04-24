const items = {};

module.exports = {
  setItem: jest.fn((key, value) => {
    items[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key) => Promise.resolve(items[key] ?? null)),
  removeItem: jest.fn((key) => {
    delete items[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(items).forEach((k) => delete items[k]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(items))),
  multiGet: jest.fn((keys) =>
    Promise.resolve(keys.map((k) => [k, items[k] ?? null]))
  ),
  multiSet: jest.fn((pairs) => {
    pairs.forEach(([k, v]) => {
      items[k] = v;
    });
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach((k) => delete items[k]);
    return Promise.resolve();
  }),
};
