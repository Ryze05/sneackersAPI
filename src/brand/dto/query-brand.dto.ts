import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class QueryBrandDto extends PaginationDto {
    
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim().toLowerCase())
    name?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLocaleLowerCase() : value))
    @IsEnum(['asc','desc'], {
        message: `sortOrder must have the following values: [asc, desc]`
    })
    sortOrder?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLocaleLowerCase() : value))
    @IsEnum(['name', 'createdAt'], {
        message: `sortOrder must have the following values: [name, createdAt]`
    })
    sortBy?: string
}