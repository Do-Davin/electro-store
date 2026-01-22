import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;
}
