import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/token/jwt.guard';
import { EditDataDto } from './dto/edit-data.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Put()
  update(@Body() editDataDto: EditDataDto) {
    return this.userService.update(editDataDto);
  }
}
