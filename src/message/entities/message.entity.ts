import { ChatEntity } from 'src/chat/entities/chat.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum MessageFrom {
  user = 'user',
  bot = 'bot',
}

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  text?: string;

  @Column()
  from: MessageFrom;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  chat: ChatEntity;

  @OneToOne(() => FileEntity, (file) => file.message, {
    cascade: true,
    nullable: true,
  })
  file?: FileEntity;
}
