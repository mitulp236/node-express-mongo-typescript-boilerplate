import {
	IsEmail,
	MaxLength,
	MinLength,
} from "class-validator";

class LoginDto {
	
	@IsEmail()
	public email: string;

	@MinLength(6, {
		message: 'Password must be greater than 6 characters',
	})
	@MaxLength(30, {
		message: 'Password must be less than 30 characters',
	})
	public password: string;
}

export default LoginDto;