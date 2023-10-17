import { Module, } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import configuration from './shared//config/appconfig';

import typeOrmConfig from './shared/config/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot(typeOrmConfig) ,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
