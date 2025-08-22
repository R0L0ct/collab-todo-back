import { PrismaService } from '../../src/prisma/prisma.service';

export const PrismaMockProvider = {
  provide: PrismaService,
  useValue: {
    todo: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
};
