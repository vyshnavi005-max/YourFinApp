import { mockTransactions } from '../data/mockData';

const FAKE_DELAY = 800; // adding a small delay so it feels like a real backend call

// get from local storage or fallback to mock data initially
function getInitialData() {
  const savedData = localStorage.getItem('finapp_v2_transactions');
  if (savedData) {
    return JSON.parse(savedData);
  }
  return mockTransactions;
}

function saveDataToLocal(data) {
  localStorage.setItem('finapp_v2_transactions', JSON.stringify(data));
}

export const api = {
  fetchTransactions: async()=> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getInitialData());
      }, FAKE_DELAY);
    });
  },

  addTransaction: async (newItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentData = getInitialData();
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
        const data = getInitialData();
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
        let data = getInitialData();
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
