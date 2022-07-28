import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorizationGuard, IUserData } from 'src/auth/auth.guard';
import { BotRepository } from './bot.repository';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { BotEntity } from './entities/bot.entity';

@UseGuards(AuthorizationGuard)
@Controller('bot')
export class BotController {
  constructor(
    private readonly botRepository: BotRepository,
    private readonly botService: BotService,
  ) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createBotDto: CreateBotDto,
  ): Promise<BotEntity> {
    const user = req.user as IUserData;
    return this.botService.create(createBotDto, user.id);
  }

  @Get()
  getAll(
    @Req() req: Request,
    @Query('take') take: string,
    @Query('page') page: string,
  ): Promise<BotEntity[]> {
    const user = req.user as IUserData;
    return this.botRepository.getAllByUserId(user.id, +take, +page);
  }

  @Put('/:id')
  async update(
    @Body() updateBotDto: UpdateBotDto,
    @Query('id') id: string,
  ): Promise<void> {
    await this.botRepository.update(+id, updateBotDto);
  }

  @Delete('/:id')
  async remove(@Query('id') id: string): Promise<void> {
    await this.botRepository.remove(+id);
  }
}
