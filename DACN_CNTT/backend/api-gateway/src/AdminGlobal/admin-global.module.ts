import { Module } from '@nestjs/common';
import { AdminGlobalController } from './admin-global.controller';
import { HttpModule } from '@nestjs/axios';


@Module({
    imports: [HttpModule],
    controllers: [AdminGlobalController],
    providers: [],
})
export class AdminGlobalModule { };