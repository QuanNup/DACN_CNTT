import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('hero.kill.dragon')
  killDragon(@Payload() name: string) {
    console.log('Received name:', name);
    const items = [
      { id: 1, name: 'Mythical Sword' + name },
      { id: 2, name: 'Key to Dungeon' + name },
    ];
    return items;
  }
}
