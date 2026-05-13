import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsLowercase, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class QuerySneakerDto extends PaginationDto {
    
    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    size?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    maxPrice?: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLocaleLowerCase() : value))
    @IsEnum(['brand', 'model', 'size', 'price'], {
        message: `sortOrder must have the following values: ['brand', 'model', 'size', 'price']`
    })
    sortBy?: string = 'price'

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLocaleLowerCase() : value))
    @IsEnum(['asc', 'desc'], {
        message: `sortOrder must have the following values: [asc, desc]`
    })
    sortOrder?: string = 'asc'

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if ([true, 'true', 1, '1'].includes(value)) return true;
        if ([false, 'false', 0, '0'].includes(value)) return false;

        return value;
    })
    isLimitedEdition?: boolean
}