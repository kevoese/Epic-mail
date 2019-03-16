const someFunction = {
  toDBArray: (obj, isId = false) => {
    const result = [];
    Object.keys(obj).forEach(value => result.push(obj[value]));
    if (isId) {
      result.shift();
      return result;
    }
    return result;
  },
};

export default someFunction;
