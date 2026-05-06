import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SneakerService } from './sneaker.service';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { PaginationSneakerDto } from './dto/pagination-sneaker.dto';
import { ParseMongoIdPipe } from '../common/pipe/parse-mongo-id/parse-mongo-id.pipe';

@Controller('sneaker')
export class SneakerController {
  constructor(private readonly sneakerService: SneakerService) {}

  @Post()
  create(@Body() createSneakerDto: CreateSneakerDto) {
    return this.sneakerService.create(createSneakerDto);
  }

  @Get()
  findAll(@Query() paginationSneakerDto: PaginationSneakerDto) {
    return this.sneakerService.findAll(paginationSneakerDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.sneakerService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateSneakerDto: UpdateSneakerDto) {
    return this.sneakerService.update(term, updateSneakerDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.sneakerService.remove(term);
  }

  @Post('seed')
  seeder() {
    return this.sneakerService.runSeed();
  }
}
