import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '../api/global-exception/global.exception';
import { ClienteModule } from './cliente.module';


@Module({
  imports: [
    ClienteModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ]
})
export class RootModule { }
