import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { Subscriber } from './entities/subcriber.entity';

@Injectable()
export class NewsletterService {
	constructor(
		@InjectRepository(Subscriber)
		private readonly subscriberRepo: Repository<Subscriber>,
	) {}

	async subscribe(dto: CreateSubscriberDto) {
		const existing = await this.subscriberRepo.findOne({
			where: { email: dto.email },
		});

		if (existing) {
			throw new ConflictException('Email already subscribed');
		}

		const subscriber = this.subscriberRepo.create({ email: dto.email });
		await this.subscriberRepo.save(subscriber);

		return { message: 'Subscribed successfully' };
	}
}
