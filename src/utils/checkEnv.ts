const checkEnv = (envName: string): string => {
  // check if environment variable is defined
  if (!process.env) {
    throw new Error('process.env is not defined');
  }

  const value = process.env[envName];

  if (!value) {
    throw new Error(`Environment variable ${envName} is not defined`);
  }

  return value;
};

export default checkEnv;
