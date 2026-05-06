import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SneakerService } from './sneaker.service';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { PaginationSneakerDto } from './dto/pagination-sneaker.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('sneakers')
@Controller('sneaker')
export class SneakerController {
  constructor(private readonly sneakerService: SneakerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sneaker.' })
  @ApiResponse({ status: 201, description: 'Sneaker successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data (Bad Request).' })
  create(@Body() createSneakerDto: CreateSneakerDto) {
    return this.sneakerService.create(createSneakerDto);
  }

  @Get()
  @ApiOperation({summary: 'Get paginated list of sneakers.'})
  @ApiResponse({ status: 200, description: 'List of sneakers returned.' })
  findAll(@Query() paginationSneakerDto: PaginationSneakerDto) {
    return this.sneakerService.findAll(paginationSneakerDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Search for sneakers by ID, SKU or Model.' })
  @ApiResponse({ status: 200, description: 'Result found.' })
  @ApiResponse({ status: 404, description: 'Sneaker not found.' })
  findOne(@Param('term') term: string) {
    return this.sneakerService.findOne(term);
  }

  @Patch(':term')
  @ApiOperation({ summary: 'Update sneaker by ID, SKU or Model' })
  @ApiResponse({ status: 200, description: 'Sneaker updated.' })
  @ApiResponse({ status: 404, description: 'Sneaker not found.' })
  update(@Param('term') term: string, @Body() updateSneakerDto: UpdateSneakerDto) {
    return this.sneakerService.update(term, updateSneakerDto);
  }

  @Delete(':term')
  @ApiOperation({ summary: 'Soft deletion of a shoe' })
  @ApiResponse({ status: 200, description: 'Sneaker deleted.' })
  @ApiResponse({ status: 404, description: 'Sneaker not found.' })
  remove(@Param('term') term: string) {
    return this.sneakerService.remove(term);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Reset and load database with test data' })
  @ApiResponse({ status: 201, description: 'Database successfully seeded.' })
  @ApiResponse({ status: 500, description: 'Internal server error during seeding.' })
  seeder() {
    return this.sneakerService.runSeed();
  }
}
