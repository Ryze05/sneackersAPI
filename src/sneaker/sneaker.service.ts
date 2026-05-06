import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sneaker } from './entities/sneaker.entity';
import { Document, HydratedDocument, isValidObjectId, Model, SortOrder } from 'mongoose';
import { PaginationSneakerDto } from './dto/pagination-sneaker.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { SneakerFilters } from './interfaces/sneaker-filters.interface';
import { SNEAKERS_SEED_DATA } from './data/sneaker.data';

@Injectable()
export class SneakerService {

  private readonly logger = new Logger('SneackerService');

  constructor(
    @InjectModel(Sneaker.name)
    private readonly sneakerModel: Model<Sneaker>
  ) { }

  async create(createSneakerDto: CreateSneakerDto): Promise<Sneaker> {
    try {
      const sneaker = await this.sneakerModel.create(createSneakerDto);
      return sneaker;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationSneakerDto: PaginationSneakerDto): Promise<PaginatedResponse<Sneaker>> {

    const { limit = 10, offset = 0, model, brand, color, size, minPrice, maxPrice, isLimitedEdition, sortBy = 'price', sortOrder = 'asc' } = paginationSneakerDto;

    const query: SneakerFilters = { isActive: true };

    if (model) query.model = { $regex: model, $options: 'i' };

    if (brand) query.brand = { $regex: brand, $options: 'i' };

    if (color) query.color = color.toLowerCase();

    if (isLimitedEdition !== undefined) query.isLimitedEdition = isLimitedEdition;

    if (size) query.size = size;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};

      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Ordenación dinámica
    const key = ['brand', 'model', 'size', 'price'].includes(sortBy) ? sortBy : 'price';
    const value = (sortOrder === 'desc') ? -1 : 1;
    const sort: { [key: string]: SortOrder } = { [key]: value };

    const [sneakers, total] = await Promise.all([
      this.sneakerModel.find(query).limit(limit).skip(offset).sort(sort).exec(),
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

  async findOne(term: string): Promise<HydratedDocument<Sneaker>> {

    let sneaker:  HydratedDocument<Sneaker> | null = null;

    if (isValidObjectId(term)) {
      sneaker = await this.sneakerModel.findOne({ _id: term, isActive: true });
    }

    if (!sneaker) {
      sneaker = await this.sneakerModel.findOne({ sku: term.toUpperCase().trim(), isActive: true });
    }

    if (!sneaker) {
      sneaker = await this.sneakerModel.findOne({
        model: {
          $regex: term.trim(),
          $options: 'i'
        },
        isActive: true
      }).sort({ price: -1 })
    }

    if (!sneaker) {
      throw new NotFoundException(`Sneaker with id, sku or model "${term}" not found`);
    }

    return sneaker;
  }

  async update(term: string, updateSneakerDto: UpdateSneakerDto): Promise<Sneaker> {
    const sneaker: HydratedDocument<Sneaker> = await this.findOne(term);

    if (updateSneakerDto.sku) updateSneakerDto.sku = updateSneakerDto.sku.toUpperCase();

    try {
      const updatedSneaker = await this.sneakerModel.findByIdAndUpdate(sneaker._id, updateSneakerDto, {new: true})
      return updatedSneaker!;
    } catch(error) {
      this.handleException(error);
    }
  }

  async remove(term: string): Promise<{message: string}> {
    const sneaker: HydratedDocument<Sneaker> = await this.findOne(term);
    try {
      // SOFT DELETE
      await this.sneakerModel.findByIdAndUpdate(sneaker._id, { isActive: false })
      //await this.sneakerModel.findByIdAndDelete(sneaker._id)
      return {
        message: `Sneaker with ${term} has been deactivated`,
      }
    } catch(error) {
      this.handleException(error);
    }
  }

  async runSeed(): Promise<{message: string, itemsInserted: number}> {
    try {
      await this.sneakerModel.deleteMany()
      await this.sneakerModel.insertMany(SNEAKERS_SEED_DATA)
      return {
        message: 'Seed executed successfully',
        itemsInserted: SNEAKERS_SEED_DATA.length
      }
    } catch(error) {
      this.handleException(error);
    }
  }

  private handleException(error: any): never {

    if (error.code === 11000) throw new BadRequestException(`Sneaker already exists in DB: ${JSON.stringify(error.keyValue)}`);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
