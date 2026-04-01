import { prisma } from '../../src/prisma';
import { truncateAll } from '../helpers/db';

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await prisma.$disconnect();
});
