import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sneaker } from './entities/sneaker.entity';
import { Model } from 'mongoose';
import { PaginationSneakerDto } from './dto/pagination-sneaker.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

@Injectable()
export class SneakerService {

  private readonly logger = new Logger('SneackerService');

  constructor(
    @InjectModel(Sneaker.name)
    private readonly sneakerModel: Model<Sneaker>
  ) { }

  async create(createSneakerDto: CreateSneakerDto): Promise<Sneaker> {
    try {
      const sneaker = await this.sneakerModel.insertOne(createSneakerDto);
      return sneaker;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationSneakerDto: PaginationSneakerDto): Promise<PaginatedResponse<Sneaker>> {

    const { limit = 10, offset = 0, model, brand, color, size, minPrice, maxPrice, isLimitedEdition } = paginationSneakerDto;

    const query: any = {};

    if (model) query.model = model;

    if (brand) query.brand = brand;

    if (color) query.color = color

    if (isLimitedEdition !== undefined) query.isLimitedEdition = isLimitedEdition;

    if (size) query.size = size

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}

      if (minPrice !== undefined) query.price.$gte = minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice
    }

    const [sneakers, total] = await Promise.all([
      this.sneakerModel.find(query).limit(limit).skip(offset).sort({ price: 1 }).exec(),
      this.sneakerModel.countDocuments(query)
    ])

    const lastPage = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    if (currentPage > lastPage && total > 0) {
      throw new BadRequestException(`La página ${currentPage} no existe. La última es la ${lastPage}`);
    }

    return {
      data: sneakers,
      total,
      limit,
      offset,
      currentPage,
      lastPage
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} sneaker`;
  }

  update(id: number, updateSneakerDto: UpdateSneakerDto) {
    return `This action updates a #${id} sneaker`;
  }

  remove(id: number) {
    return `This action removes a #${id} sneaker`;
  }

  private handleException(error: any): never {

    if (error.code === 11000) throw new BadRequestException(`Sneaker already exists in DB: ${JSON.stringify(error.keyValue)}`);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
