const someFunction = {

  multiInsert: (arr, groupmsgObj) => {
    const {
      id, subject, message, userId, groupId, parentMessageId, readStatus,
    } = groupmsgObj;
    let insertStr = '';
    arr.forEach((obj) => {
      const { member } = obj;
      insertStr += `(${member}, ${id}, '${subject}', '${message}', ${userId}, ${groupId}, ${parentMessageId}, '${readStatus}'), `;
    });
    insertStr = insertStr.slice(0, -2);
    insertStr += ';';
    return insertStr;
  },
};

export default someFunction;
