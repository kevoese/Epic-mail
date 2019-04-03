const token = (!localStorage.token) ? null : localStorage.token;

const fetchCall = async (url, method, body = undefined) => {
  const object = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      token,
    }),
    body: JSON.stringify(body),
  };
  const response = await fetch(url, object);
  const responseObj = await response.json();
  const statusCode = responseObj.status;
  if (statusCode === 200) { return responseObj; }
  return false;
};


export default fetchCall;
