import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Sneaker {
    
    @Prop({
        index: true,
        trim: true,
        lowercase: true,
        required: true
    })
    model!: string

    @Prop({
        index: true,
        trim: true,
        lowercase: true,
        required: true
    })
    brand!: string

    @Prop({
        unique: true,
        index: true,
        uppercase: true,
        required: true
    })
    sku!: string

    @Prop({
        index: true,
        default: 0,
        min: 0
    })
    size!: number

    @Prop({
        index: true,
        trim: true,
        lowercase: true,
        required: true
    })
    color!: string

    @Prop({
        default: 0,
        min: 0
    })
    price!: number

    @Prop({
        default: false
    })
    isLimitedEdition!: boolean;

    @Prop({
        default: true,
        index: true
    })
    isActive!: boolean;
}

export const SneakerSchema = SchemaFactory.createForClass( Sneaker )