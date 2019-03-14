import database from '../Models/database';

const data = {
  add: (storage, newData) => {
    const size = database[storage].length;
    newData.id = size + 1;
    database[storage].push(newData);
    return newData;
  },

  updateOne: (storage, id, oldItem, newItem) => {
    const dataStorage = database[storage];
    const dataObj = dataStorage[id - 1];
    dataObj[oldItem] = newItem;
    return newItem;
  },

  deletemsg: (storage, id, userId) => {
    const messages = database[storage];
    const message = messages[id - 1];
    if (message === undefined) return false;
    const deletedMsg = JSON.parse(JSON.stringify(message.message));
    if (message.senderId === userId) {
      delete messages[id - 1];
    } if (message.receiverId === userId) message.receiverdelete = true;
    return deletedMsg;
  },

  getStorage: storage => database[storage],

  getById: (storage, id, userId) => {
    const dataStorage = database[storage];
    const message = dataStorage[id - 1];
    if (message === undefined) return false;
    if ((message.senderId === userId) || (message.receiverId === userId)) {
      return message;
    }
    return false;
  },

  sortItem: (storage, key, value) => {
    const dataStorage = database[storage];
    const result = dataStorage.filter(element => (element[key] === value));
    return result;
  },

  findItem: (storage, key, value) => {
    const dataStorage = database[storage];
    const result = dataStorage.find(element => (element[key] === value));
    return result;
  },
};


export default data;
