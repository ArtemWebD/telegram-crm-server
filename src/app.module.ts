import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { ChatModule } from './chat/chat.module';
import { FileModule } from './file/file.module';
import { MessageModule } from './message/message.module';
import { AppGateway } from './app.gateway';
import { BotModule } from './bot/bot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SocketModule } from './socket/socket.module';
import { OptimizerModule } from './optimizer/optimizer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    TokenModule,
    ChatModule,
    FileModule,
    MessageModule,
    BotModule,
    SocketModule,
    OptimizerModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
