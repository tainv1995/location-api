import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto, LocationTreeNode, UpdateLocationDto } from './location.dto';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private locationRepository: Repository<Location>,
    ) { }

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
         const location = new Location();
         if (createLocationDto.parentId) {
             const parentLocation = await this.locationRepository.findOne({ where: { id: createLocationDto.parentId } });
             if (!parentLocation) {
                 throw new NotFoundException(`Parent location with ID ${createLocationDto.parentId} not found.`);
             }
             location.parentId = createLocationDto.parentId;
         }
         location.building = createLocationDto.building;
         location.name = createLocationDto.name;
         location.number = createLocationDto.number;
         location.area = createLocationDto.area;
        return this.locationRepository.save(location);
    }

    findAll(): Promise<Location[]> {
        return this.locationRepository.find();
    }

    findOne(id: number): Promise<Location> {
        return this.locationRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        const location = await this.locationRepository.findOne({ where: { id } });
        if (!location) {
            throw new NotFoundException('Location not found');
        }
        await this.removeAllChildren(id);
        await this.locationRepository.remove(location);
    }

    async removeAllChildren(parentId: number): Promise<void> {
        await this.locationRepository.delete({ parentId });
    }

    async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
        const location = await this.locationRepository.findOne({ where: { id } });
        if (!location) {
            throw new NotFoundException('Location not found');
        }

        Object.assign(location, updateLocationDto);
        await this.locationRepository.save(location);
        return location;
    }

    async getLocationTree(): Promise<LocationTreeNode[]> {
        const query = `
          WITH RECURSIVE cte AS (
            SELECT *
            FROM "location" AS al 
            WHERE "parentId" IS NULL
            UNION ALL
            SELECT loc.*
            FROM "location" AS loc
            JOIN cte on cte.id = loc."parentId"
          )
          SELECT * FROM cte
        `;
        const locations = await this.locationRepository.query(query);
        return this.buildLocationTree(locations);
    }

    private buildLocationTree(locations: Location[]): LocationTreeNode[] {
        const locationMap = new Map<number, LocationTreeNode>();
    
        locations.forEach(location => {
            locationMap.set(location.id, { ...location, children: [] });
        });
    
        const tree: LocationTreeNode[] = [];
    
        locations.forEach(location => {
            if (location.parentId) {
                const parent = locationMap.get(location.parentId);
                parent.children.push(locationMap.get(location.id));
            } else {
                tree.push(locationMap.get(location.id));
            }
        });
    
        return tree;
    }
}
