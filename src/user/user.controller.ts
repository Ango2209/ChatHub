import { Controller, Get, HttpStatus, InternalServerErrorException, UseGuards, Request, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService,
      private authService: AuthService
      ) {}
    

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
    @Post('/refresh-token')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        try {
            const newAccessToken = await this.authService.refreshToken(refreshToken);
            return { accessToken: newAccessToken };
        } catch (error) {
            console.log("Error in refreshToken: ", error.message);
            throw new InternalServerErrorException('Internal server error');
        }
    }
}