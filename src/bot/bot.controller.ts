import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthorizationGuard, IUserData } from 'src/auth/auth.guard';
import { BotRepository } from './bot.repository';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { BotEntity } from './entities/bot.entity';

@Controller('bot')
export class BotController {
  constructor(
    private readonly botRepository: BotRepository,
    private readonly botService: BotService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: {
        fileSize: 10485760,
      },
    }),
  )
  @Post()
  create(
    @Req() req: Request,
    @Body() createBotDto: CreateBotDto,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<BotEntity> {
    const user = req.user as IUserData;
    return this.botService.create(createBotDto, user.id, photo?.buffer);
  }

  @UseGuards(AuthorizationGuard)
  @Get()
  getAll(
    @Req() req: Request,
    @Query('take') take: string,
    @Query('page') page: string,
  ): Promise<BotEntity[]> {
    const user = req.user as IUserData;
    return this.botRepository.getAllByUserId(user.id, +take, +page);
  }

  @UseGuards(AuthorizationGuard)
  @Put('/:id')
  async update(
    @Body() updateBotDto: UpdateBotDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.botRepository.update(+id, updateBotDto);
  }

  @UseGuards(AuthorizationGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.botService.remove(+id);
  }
}
