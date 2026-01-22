import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
	constructor(private readonly newsletterService: NewsletterService) {}

	@Post()
	subscribe(@Body() dto: CreateSubscriberDto) {
		return this.newsletterService.subscribe(dto);
	}
}
