import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SocketIoAdapter } from './socket-io.adapter';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get<ConfigService>(ConfigService);
  app.use('/static', express.static(path.join(__dirname, 'static')));

  app.useWebSocketAdapter(new SocketIoAdapter(app, true));

  app.use(cookieParser());
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.enableCors({
    credentials: true,
    origin: config.get<string>('CREDENTIALS_ORIGIN'),
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
      'Access-Control-Allow-Origin',
      config.get<string>('CREDENTIALS_ORIGIN'),
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE');
    next();
  });

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
