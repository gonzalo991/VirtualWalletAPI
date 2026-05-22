// config/env.ts
export const env = {
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
};

console.log("ENV: ",env)
console.log("JWT_SECRET: ", process.env.JWT_SECRET)