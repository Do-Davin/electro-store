import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscribers')
export class Subscriber {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@CreateDateColumn()
	createdAt: Date;
}
