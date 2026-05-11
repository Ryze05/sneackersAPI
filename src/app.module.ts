import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SneakerModule } from './sneaker/sneaker.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfig } from './common/config/env.config';
import { JoiValidationSchema } from './common/config/Joi.validator';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env'
    }),
    SneakerModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URL');
        
        return {
          uri
        }
      }
    }),
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
