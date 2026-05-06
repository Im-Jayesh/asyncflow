import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendBulkEmailDto {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsOptional()
    @IsDateString()
    sendAt?: string;
}