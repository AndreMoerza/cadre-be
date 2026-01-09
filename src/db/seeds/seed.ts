import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserFactory } from './factories/user/user.factory';

const run = async () => {
  try {
    const app = await NestFactory.create(SeedModule);
    console.log('Running seed');
    await app.get(UserFactory).run();

    await app.close();
  } catch (error) {
    console.error('Error running seed :: ', error);
    throw new Error('Error running seed');
  }
};

void run();
