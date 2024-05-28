import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './location.entity';
import { CreateLocationDto, LocationTreeNode, UpdateLocationDto } from './location.dto';
import { ApiBody, ApiTags, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Post()
    @ApiBody({ 
        type: CreateLocationDto,
        examples: {
            'basic': {
            value: {
                building: 'Building A',
                name: 'Room 101',
                number: '101',
                area: 50,
            }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'The location has been successfully created.' })
    @ApiBadRequestResponse({ description: 'Invalid data provided.' })
    async create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
        return this.locationService.create(createLocationDto);
    }
    
    @Get('tree')
    async getLocationTree(): Promise<LocationTreeNode[]> {
        return this.locationService.getLocationTree();
    }

    @Get()
    @ApiResponse({ status: 200, description: 'List of all locations.' })
    findAll(): Promise<Location[]> {
        return this.locationService.findAll();
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Location found.' })
    @ApiNotFoundResponse({ description: 'Location not found.' })
    findOne(@Param('id') id: number): Promise<Location> {
        return this.locationService.findOne(id);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Location has been successfully deleted.' })
    @ApiNotFoundResponse({ description: 'Location not found.' })
    async remove(@Param('id') id: number): Promise<void> {
        await this.locationService.remove(id);
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Location has been successfully updated.' })
    @ApiNotFoundResponse({ description: 'Location not found.' })
    async update(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto): Promise<Location> {
        return this.locationService.update(id, updateLocationDto);
    }
}
