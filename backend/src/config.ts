const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
};

export const config = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  jwtSecret: required('JWT_SECRET'),
  databaseUrl: required('DATABASE_URL'),
  jwtExpiresIn: '7d' as const,
};
