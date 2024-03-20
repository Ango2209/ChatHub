import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMessageDto } from './dto/add-message.dto';
import { Message } from 'src/room/entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async addMessage(addMessageDto: AddMessageDto): Promise<Message> {
    const newMessage = this.messageRepository.create(addMessageDto);
  
    // Find the User entity corresponding to userId
    const user = await this.userService.findOne(addMessageDto.userId);
    // Assign the User entity to newMessage
    newMessage.user = user;
  
    await this.messageRepository.save(newMessage);
    return newMessage;
  }
  async getMessagesBetweenTwoUsers(
    userId: string,
    recipientId: string,
  ): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message') 
      .leftJoinAndSelect('message.user', 'user') // Lấy thông tin của người gửi tin nhắn
      .where('message.recipientId = :recipientId AND user.id = :userId', { // Lấy tin nhắn từ người gửi đến người nhận
        userId,
        recipientId,
      })
      .orWhere('message.recipientId = :userId AND user.id = :recipientId', { // Lấy tin nhắn từ người nhận đến người gửi
        userId,
        recipientId,
      })
      .getMany();
  }
}
