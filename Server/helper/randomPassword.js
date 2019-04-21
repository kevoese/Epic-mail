import generator from 'generate-password';

const randomPassword = () => {
  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: true,
  });

  return password;
};

export default randomPassword;
