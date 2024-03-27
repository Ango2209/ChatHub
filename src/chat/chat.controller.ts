import { Body, Controller, Get, Injectable, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MessageService } from './chat.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AWSUploader } from './fileUploader.service';
import { ChatGateway } from './chat.gateway';
import { AddMessageDto } from './dto/add-message.dto';

@Injectable()
@Controller('messages')
export class MessageController {
  private readonly awsUploader: AWSUploader;
  
  constructor(private readonly messageService: MessageService,private readonly chatGateway: ChatGateway) {
    this.awsUploader = new AWSUploader();
  }
 
  @Get(':userId/:recipientId')
  getMessagesBetweenTwoUsers(@Param('userId') userId: string, @Param('recipientId') recipientId: string) {
   
    
    return this.messageService.getMessagesBetweenTwoUsers(userId, recipientId);
  }
  @UseInterceptors(FileInterceptor('image'))
  @Post("/uploadImage")
  async uploadImage(@UploadedFile()file:Express.Multer.File, @Body() message:AddMessageDto) {
   
  
      this.awsUploader.uploadFile(file, (error, data) => {
        if (error) {
          console.error("Error uploading file:", error);
          return false;
         
        }
        const imgUrl = data.Location;
        message.text = imgUrl;
        this.messageService.addMessage(message);
        const clientId=this.chatGateway.connectedUsers.get(message.recipientId);
        this.chatGateway.server.to(clientId).emit('message', { text: imgUrl });
          return true
      });
    
    
   
  }
}
