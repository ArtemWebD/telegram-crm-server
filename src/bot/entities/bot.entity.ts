import { ChatEntity } from 'src/chat/entities/chat.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bot')
export class BotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column()
  first_name: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  chatJoinRequestText?: string;

  @Column({ default: false })
  approveRequests: boolean;

  @OneToOne(() => FileEntity, (file) => file.bot, {
    cascade: true,
    nullable: true,
  })
  chatJoinRequestImage?: FileEntity;

  @ManyToOne(() => UserEntity, (user) => user.bots)
  user: UserEntity;

  @OneToMany(() => ChatEntity, (chat) => chat.bot, {
    cascade: true,
  })
  chats: ChatEntity[];
}
