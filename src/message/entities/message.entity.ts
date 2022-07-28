import { ChatEntity } from 'src/chat/entities/chat.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MessageFrom {
  user = 'user',
  bot = 'bot',
}

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  text?: string;

  @Column()
  from: MessageFrom;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn()
  chat: ChatEntity;

  @OneToMany(() => FileEntity, (file) => file.message, {
    cascade: true,
    nullable: true,
  })
  files: FileEntity[];
}
