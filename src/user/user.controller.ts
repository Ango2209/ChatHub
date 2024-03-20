import { Controller, Get, HttpStatus, InternalServerErrorException, UseGuards, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard('jwt'))  
    @Get('/users-sidebar')
    async getUserForSidebar(@Request() req) {
      try {
        const loggedInUser = req.user.id;
        const filteredUsers = await this.userService.getUserForSidebar(loggedInUser);
        return  filteredUsers ;
      } catch (error) {
        console.log("Error in getUserForSidebar: ", error.message);
        throw new InternalServerErrorException('Internal server error');
      }
    }
}