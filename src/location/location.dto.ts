import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLocationDto {
    @IsNotEmpty()
    @IsString()
    building: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    number: string;

    @IsNotEmpty()
    @IsNumber()
    area: number;

    @IsOptional()
    parentId: number;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

export interface LocationTreeNode {
    id: number;
    building: string;
    name: string;
    number: string;
    area: number;
    parentId?: number;
    children: LocationTreeNode[];
}
