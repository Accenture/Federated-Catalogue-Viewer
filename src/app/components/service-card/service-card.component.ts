import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ServiceCard, Resource } from '../../types/dtos';
import { FormatDescriptionPipe } from '../../util/format-description.pipe';

export interface CarouselIndexes {
    dataResourceIndex: number;
    serviceAccessPointIndex: number;
    physicalResourceIndex: number;
}

enum IndexType {
    DataResource = 'dataResourceIndex',
    ServiceAccessPoint = 'serviceAccessPointIndex',
    PhysicalResource = 'physicalResourceIndex',
}

@Component({
    selector: 'app-service-card',
    standalone: true,
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
    imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule, MatButtonModule, FormatDescriptionPipe],
})
export class ServiceCardComponent {
    @Input({ required: true }) service!: ServiceCard;
    @Output() viewGraph = new EventEmitter<number>();

    indexes: CarouselIndexes = {
        dataResourceIndex: 0,
        serviceAccessPointIndex: 0,
        physicalResourceIndex: 0,
    };

    IndexType = IndexType;

    updateIndex(
        indexType: IndexType,
        resources: (Resource & { groupIds?: number[] })[],
        direction: 'next' | 'previous',
    ): void {
        const groupedResources = resources.filter((resource) => resource.groupIds && resource.groupIds.length > 0);
        const groupIds = [...new Set(groupedResources.flatMap((r) => r.groupIds ?? []))].sort((a, b) => a - b);

        if (groupIds.length > 0) {
            const currentGroupId = groupIds[this.indexes[indexType]] ?? groupIds[0];
            const currentIndex = groupIds.indexOf(currentGroupId);

            const newIndex =
                direction === 'next'
                    ? (currentIndex + 1) % groupIds.length
                    : (currentIndex - 1 + groupIds.length) % groupIds.length;

            const newGroupId = groupIds[newIndex];

            // Sync group indexes & set to first
            (Object.keys(this.indexes) as (keyof CarouselIndexes)[]).forEach((key) => {
                const resourceSet = this.getResourceSetByIndexType(key);
                const grouped = resourceSet.filter((res) => res.groupIds?.includes(newGroupId));
                this.indexes[key] = grouped.length ? resourceSet.indexOf(grouped[0]) : 0;
            });
        } else {
            // Fallback if resource is standalone
            const currentIndex = this.indexes[indexType];
            const maxIndex = resources.length - 1;
            this.indexes[indexType] =
                direction === 'next'
                    ? (currentIndex + 1) % (maxIndex + 1)
                    : (currentIndex - 1 + maxIndex + 1) % (maxIndex + 1);
        }
    }

    private getResourceSetByIndexType(indexType: keyof CarouselIndexes): (Resource & { groupIds?: number[] })[] {
        switch (indexType) {
            case IndexType.DataResource:
                return this.service.dataResources ?? [];
            case IndexType.ServiceAccessPoint:
                return this.service.serviceAccessPoints ?? [];
            case IndexType.PhysicalResource:
                return this.service.physicalResources ?? [];
            default:
                return [];
        }
    }

    getCurrentResource<T extends Resource>(resources: T[] | undefined, index: number | undefined): T | null {
        if (!resources || index === undefined || index < 0 || index >= resources.length) return null;
        return resources[index];
    }

    getMaxGroupCount(): number {
        const allResources = [
            ...(this.service.dataResources || []),
            ...(this.service.serviceAccessPoints || []),
            ...(this.service.physicalResources || []),
        ];

        const groupIds = new Set(
            allResources.filter((r) => r.groupIds && r.groupIds.length > 0).flatMap((r) => r.groupIds as number[]),
        );

        return groupIds.size || 1;
    }
}
