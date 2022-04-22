import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './socket-io.adapter';
import { Response, Request, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app, true));
  const config = app.get(ConfigService);
  const PORT = process.env.PORT;
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
      hidePoweredBy: true,
    }),
  );
  app.use(cookieParser());
  app.use(
    session({
      secret: config.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
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
  //app.use(csurf());
  await app.listen(PORT, () => {
    console.log(`App was started on port ${PORT}`);
  });
}
bootstrap();
