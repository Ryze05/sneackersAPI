import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsLowercase, IsNotEmpty, IsNumber, IsOptional, IsString, IsUppercase, Matches, Min } from "class-validator";

export class CreateSneakerDto {
    
    @ApiProperty({ example: 'NIKE-1234', description: 'Unique SKU code' })
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    @Matches(/^[A-Z]{3,10}-\d{4}$/, {
        message: `The SKU is invalid. It must be in the format BRAND-0000 (e.g., NIKE-1234)`
    })
    sku!: string;

    @ApiProperty({ example: 'air force 1' })
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    model!: string;

    @ApiProperty({ example: 'nike' })
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    brand!: string;

    @ApiProperty({ example: 42 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    size!: number;

    @ApiProperty({ example: 'white' })
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    color!: string;

    @ApiProperty({ example: 110.99 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    price!: number;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    @Transform(({value}) => {
        if (['true', true, 1, '1'].includes(value)) return true;
        if (['false', false, 0, '0'].includes(value)) return false; 
        return value;
    })
    isLimitedEdition?: boolean;
}
