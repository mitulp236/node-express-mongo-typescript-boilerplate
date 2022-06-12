import {
	Contains,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";

class ForgotPasswordVerifyDto {
	@IsString()
	@IsNotEmpty()
	public token: string;

	@MinLength(6, {
		message: 'Password must be greater than 6 characters',
	})
	@MaxLength(30, {
		message: 'Password must be less than 30 characters',
	})
	public newPassword: string;

}

export default ForgotPasswordVerifyDto;