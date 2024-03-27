import { IsOptional, IsString, IsUUID } from 'class-validator';

export class AddMessageDto {
  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsUUID()
  roomId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsUUID()
  recipientId: string;

  @IsOptional()
  created_at: Date;

  @IsOptional()
  fileData: ArrayBuffer;
}
