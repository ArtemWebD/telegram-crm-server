import { ChatEntity } from 'src/chat/entities/chat.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bot')
export class BotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  first_name: string;

  @Column()
  username: string;

  @ManyToOne(() => UserEntity, (user) => user.bots)
  user: UserEntity;

  @OneToMany(() => ChatEntity, (chat) => chat.bot, {
    cascade: true,
  })
  chats: ChatEntity[];
}
