import { mockTransactions } from '../data/mockData';

const FAKE_DELAY = 800; // adding a small delay so it feels like a real backend call
const STORAGE_KEY = 'finapp_v2_transactions';
const BOOTSTRAP_KEY = 'finapp_v2_bootstrapped';

function getStoredData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveDataToLocal(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function seedInitialDataIfNeeded() {
  const hasBootstrapped = localStorage.getItem(BOOTSTRAP_KEY) === '1';
  const existing = getStoredData();

  if (!hasBootstrapped || !existing) {
    saveDataToLocal(mockTransactions);
    localStorage.setItem(BOOTSTRAP_KEY, '1');
    return [...mockTransactions];
  }

  return existing;
}

function getCurrentData() {
  return getStoredData() ?? seedInitialDataIfNeeded();
}

export const api = {
  fetchTransactions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getCurrentData());
      }, FAKE_DELAY);
    });
  },

  addTransaction: async (newItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentData = getCurrentData();
        // just spoofing a quick id
        const itemWithId = { ...newItem, id: Date.now().toString() };

        const updatedData = [itemWithId, ...currentData];
        saveDataToLocal(updatedData);
        resolve(itemWithId);
      }, FAKE_DELAY);
    });
  },

  updateTransaction: async (id, updatedFields) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getCurrentData();
        const itemIndex = data.findIndex(item => item.id === id);

        if (itemIndex === -1) {
          return reject(new Error('Transaction not found.'));
        }

        data[itemIndex] = { ...data[itemIndex], ...updatedFields };
        saveDataToLocal(data);
        resolve(data[itemIndex]);
      }, FAKE_DELAY);
    });
  },

  deleteTransaction: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let data = getCurrentData();
        const startLength = data.length;
        data = data.filter(item => item.id !== id);

        if (data.length === startLength) {
          return reject(new Error("Couldn't find that transaction to delete"));
        }

        saveDataToLocal(data);
        resolve(true); // success
      }, FAKE_DELAY);
    });
  }
};
