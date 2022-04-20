import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MessageFrom {
  bot = 'bot',
  user = 'user',
}

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column()
  from: MessageFrom;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  text?: string;

  @Column({ type: 'jsonb', nullable: true })
  buttonText?: string;

  @Column({ type: 'jsonb', nullable: true })
  file?: string;
}
