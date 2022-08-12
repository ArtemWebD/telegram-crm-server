import { BotEntity } from 'src/bot/entities/bot.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { MessageEntity } from 'src/message/entities/message.entity';
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

  @Column({ type: 'bigint' })
  chatId: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  username?: string;

  @ManyToOne(() => BotEntity, (bot) => bot.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bot: BotEntity;

  @OneToOne(() => FileEntity, (file) => file.chat, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  photo?: FileEntity;

  @OneToMany(() => MessageEntity, (message) => message.chat, {
    cascade: true,
  })
  messages: MessageEntity[];
}
