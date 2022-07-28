import { BotEntity } from 'src/bot/entities/bot.entity';
import { TokenEntity } from 'src/token/entities/token.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @OneToOne(() => TokenEntity, (token) => token.user, {
    cascade: true,
  })
  token: TokenEntity;

  @OneToMany(() => BotEntity, (bot) => bot.user, {
    cascade: true,
  })
  bots: BotEntity[];
}
