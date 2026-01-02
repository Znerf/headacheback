import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

export const app = express();

async function createApp() {
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(app),
    {
      logger: ['error', 'warn', 'log', 'debug'],
    }
  );
  
  nestApp.enableCors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  nestApp.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await nestApp.init();
  return nestApp;
}

async function bootstrap() {
  const nestApp = await createApp();
  const port = process.env.PORT || 3001;
  await nestApp.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}

// For Vercel serverless
if (require.main === module) {
  bootstrap();
}

// Export for Vercel
export default async (req: any, res: any) => {
  await createApp();
  app(req, res);
};
