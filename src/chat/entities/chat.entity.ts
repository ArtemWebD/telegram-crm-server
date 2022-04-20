import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ChatStatus {
  registered = 'Прошел регистрацию',
  madeDeposit = 'Сделал депозит',
  didNotMakeDeposit = 'Не сделал депозит',
  repeatDeposit = 'Повторный депозит',
  default = 'Не указан',
}

@Entity('chat')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  chatId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column()
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  username: string;

  @Column({ type: 'int', nullable: true, array: true })
  image: number[];

  @Column({ default: ChatStatus.default })
  status: ChatStatus;
}
