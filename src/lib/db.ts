import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Move adapter creation inside the singleton function
const prismaClientSingleton = () => {
  // Use the non-null assertion (!) for strict TypeScript environments
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!, 
  });
  
  return new PrismaClient({ adapter });
};

// 2. Define the global type
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 3. Instantiate or retrieve the client
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// 4. Preserve it during hot-reloads in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;