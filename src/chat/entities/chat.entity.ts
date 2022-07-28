import { FileEntity } from 'src/file/entities/file.entity';
import { MessageEntity } from 'src/message/entities/message.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  username?: string;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => FileEntity, (file) => file.chat, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  photo?: FileEntity;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];
}
