const errorResponse = (statCode, error, res) => res.status(statCode).json({
  status: statCode,
  error,
});

export default errorResponse;
