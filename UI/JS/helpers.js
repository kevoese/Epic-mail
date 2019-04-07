const token = (!localStorage.token) ? null : localStorage.token;


const fetchCall = async (url, method, body = undefined) => {
  const object = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
  };
  const response = await fetch(url, object);
  const statusCode = response.status;
  const responseObj = await response.json();
  console.log(responseObj);
  return { responseObj, statusCode };
};
