import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get<ConfigService>(ConfigService);

  app.useWebSocketAdapter(new SocketIoAdapter(app, true));

  app.use(cookieParser());
  app.use(helmet());

  app.enableCors();

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
