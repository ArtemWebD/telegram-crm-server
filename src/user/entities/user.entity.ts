import { ChatEntity } from 'src/chat/entities/chat.entity';
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

  @OneToMany(() => ChatEntity, (chat) => chat.user, {
    cascade: true,
  })
  chats: ChatEntity[];
}
