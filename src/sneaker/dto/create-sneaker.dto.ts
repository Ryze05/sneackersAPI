import { Transform, Type } from "class-transformer";
import { IsBoolean, IsLowercase, IsNotEmpty, IsNumber, IsOptional, IsString, IsUppercase, Matches, Min } from "class-validator";

export class CreateSneakerDto {
    
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    @Matches(/^[A-Z]{3,10}-\d{4}$/, {
        message: `The SKU is invalid. It must be in the format BRAND-0000 (e.g., NIKE-1234)`
    })
    sku!: string;

    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    model!: string;

    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    brand!: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    size!: number;

    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    color!: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    price!: number;

    @IsBoolean()
    @IsOptional()
    @Transform(({value}) => {
        if (['true', true, 1, '1'].includes(value)) return true;
        if (['false', false, 0, '0'].includes(value)) return false; 
        return value;
    })
    isLimitedEdition?: boolean;
}
