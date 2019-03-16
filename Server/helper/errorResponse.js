const errorResponse = (statCode, error, res) => res.status(statCode).send({
  status: 'Failure',
  error,
});

export default errorResponse;
