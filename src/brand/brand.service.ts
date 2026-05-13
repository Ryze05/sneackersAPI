import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './entities/brand.entity';
import { HydratedDocument, isValidObjectId, Model, SortOrder } from 'mongoose';
import { QueryBrandDto } from './dto/query-brand.dto';
import { BrandFilters } from './interfaces/brand-filters.interface';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

@Injectable()
export class BrandService {

  private readonly logger = new Logger('BrandService');

  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<Brand> 
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      const brand = await this.brandModel.create(createBrandDto)
      return brand;

    } catch(error) {
      this.handleException(error)
    }
  }

  async findAll(queryBrandDto: QueryBrandDto): Promise<PaginatedResponse<Brand>> {
    
    const { limit = 10, offset = 0, name, sortOrder = 'desc', sortBy = 'createdAt' } = queryBrandDto;

    const query: BrandFilters = {isActive: true};

    if (name) query.name = { $regex: name, $options: 'i' };

    const key = ['name', 'createdAt'].includes(sortBy) ? sortBy : 'createdAt';

    const order: SortOrder = (sortOrder === 'desc') ? -1 : 1;

    const sort: {[key: string]: SortOrder} = {[key]: order};

    const [total, data] = await Promise.all([
      this.brandModel.countDocuments(query),
      this.brandModel.find(query).limit(limit).skip(offset).sort(sort)
    ]);

    const currentPage = Math.floor(offset/limit) + 1;
    const lastPage = Math.ceil(total / limit) || 1;

    if (currentPage > lastPage && total > 0) {
      throw new BadRequestException(`The page ${currentPage} does not exist. The last page is ${lastPage}.`);
    }
    
    return {
      data,
      total,
      limit,
      offset,
      currentPage,
      lastPage
    };
  }

  async findOne(term: string): Promise<HydratedDocument<Brand>>{
    
    let brand: HydratedDocument<Brand> | null = null; 
    
    if (isValidObjectId(term)) {
      brand = await this.brandModel.findOne({ _id: term, isActive: true })
    }

    //! Change
    if (!brand) {
      brand = await this.brandModel.findOne({
        name: {
          $regex: term.trim()
        },
        isActive: true
      }).sort({ name: 1 })
    }

    if (!brand) {
      throw new NotFoundException(`Brand with id or name "${term}" not found`)
    }

    return brand;
  }

  async update(term: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(term);
    try {
      brand.set(updateBrandDto);
      await brand.save();
      return brand;
    } catch(error) {
      this.handleException(error);
    }
  }

  async remove(term: string): Promise<{message: string}> {
    const brand = await this.findOne(term)
  
    try {
      brand.isActive = false;
      await brand.save();

      return {
        message: `brand with name "${brand.name}" has been deactivated`
      }
    } catch(error) {
      this.handleException(error);
    }
  }

  private handleException(error: any): never {

    if (error.code === 11000) throw new BadRequestException(`Brand already exists in DB: ${JSON.stringify(error.keyValue)}`);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
