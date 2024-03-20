import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './chat.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':userId/:recipientId')
  getMessagesBetweenTwoUsers(@Param('userId') userId: string, @Param('recipientId') recipientId: string) {
    return this.messageService.getMessagesBetweenTwoUsers(userId, recipientId);
  }
}