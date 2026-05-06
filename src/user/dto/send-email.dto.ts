import { IsEmail, IsString } from "class-validator";
import { SendBulkEmailDto } from "./send-bulk-email.dto";

export class SendEmailDto extends SendBulkEmailDto {
    @IsEmail()
    @IsString()
    email!: string;
}