const someFunction = {
  toDBArray: (obj) => {
    const result = [];
    Object.keys(obj).forEach(value => result.push(obj[value]));
    return result;
  },
};

export default someFunction;
