import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  @JoinColumn()
  user: UserEntity;
}
