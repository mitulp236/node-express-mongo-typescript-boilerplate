import {
	Contains,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";

class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	public firstName: string;
	@IsString()
	@IsNotEmpty()
	public lastName: string;
	@IsEmail()
	public email: string;

	@MinLength(6, {
		message: 'Password must be greater than 6 characters',
	})
	@MaxLength(30, {
		message: 'Password must be less than 30 characters',
	})
	public password: string;

	@IsOptional()
	@MinLength(10, {
		message: 'Mobile number must contain 10 digits',
	})
	@MaxLength(10, {
		message: 'Mobile number must contain 10 digits',
	})
	public mobile: string;

	@IsOptional()
	@Contains('+')
	public dialCode: string;
}

export default CreateUserDto;