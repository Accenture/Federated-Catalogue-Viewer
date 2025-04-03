import { Injectable } from '@angular/core';
import {
    NodeQueryResult,
    ServiceCard,
    Resource,
    DataResource,
    PhysicalResource,
    ServiceAccessPoint,
    AssetNode,
    LegalParticipant,
    LegalRegistrationNumber,
    ServiceOffering,
    Asset,
} from '../types/dtos';
import { isEqual } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class CardDataService {
    fillServiceCard(serviceOffering: Resource, items: NodeQueryResult[]): ServiceCard {
        const serviceCard: ServiceCard = {
            legalParticipant: { id: 0, name: 'undefined', description: [] },
            legalRegistrationNumber: { id: 0, description: [], vatID: '', leiCode: '', countryCode: '' },
            serviceOffering: { id: serviceOffering.id, name: serviceOffering.name || '', description: [], policy: [] },
            serviceAccessPoints: [],
            physicalResources: [],
            dataResources: [],
        };

        const nodeClassesToGroup = [
            'DataResource',
            'InstantiatedVirtualResource',
            'ServiceAccessPoint',
            'PhysicalResource',
        ];
        const nodesToGroup: AssetNode[] = [];

        const assetsMap = new Map<number, { id: number; type: string; asset: Asset }>();

        items.forEach((item) => {
            if (item.labels) {
                const matchedLabel = item.labels.find((label: string) => nodeClassesToGroup.includes(label));

                if (matchedLabel && item.relation) {
                    nodesToGroup.push({
                        assetId: item.id,
                        linkedAssetId: item.relation.id,
                        assetLabel: matchedLabel,
                    });
                }
            }

            if (item.labels.includes('LegalParticipant') && item.value['legalName']) {
                if (!assetsMap.has(item.id)) {
                    const legalParticipant: LegalParticipant = {
                        id: item.id,
                        name: item.value['legalName'] as string,
                        description: (item.value['description'] as string[]) || [],
                    };
                    serviceCard.legalParticipant = legalParticipant;
                    assetsMap.set(item.id, { id: item.id, type: 'LegalParticipant', asset: legalParticipant });
                }
            }

            if (item.labels.includes('legalRegistrationNumber')) {
                if (!assetsMap.has(item.id)) {
                    const legalRegistrationNumber: LegalRegistrationNumber = {
                        id: item.id,
                        description: (item.value['description'] as string[]) || [],
                        vatID: (item.value['vatID'] as string) || '',
                        leiCode: (item.value['leiCode'] as string) || '',
                        countryCode:
                            (item.value['vatID-countryCode'] as string) ||
                            (item.value['leiCode-countryCode'] as string) ||
                            '',
                        subdivisionCountryCode:
                            (item.value['vatID-subdivisionCountryCode'] as string) ||
                            (item.value['leiCode-subdivisionCountryCode'] as string) ||
                            '',
                    };
                    serviceCard.legalRegistrationNumber = legalRegistrationNumber;
                    assetsMap.set(item.id, {
                        id: item.id,
                        type: 'legalRegistrationNumber',
                        asset: legalRegistrationNumber,
                    });
                }
            }

            if (item.labels.includes('ServiceOffering') && item.value['name']) {
                if (!assetsMap.has(item.id)) {
                    const serviceOffering: ServiceOffering = {
                        id: item.id,
                        name: item.value['name'] as string,
                        description: (item.value['description'] as string[]) || [],
                        policy: (item.value['policy'] as string[]) || [],
                    };
                    serviceCard.serviceOffering = serviceOffering;
                    assetsMap.set(item.id, { id: item.id, type: 'ServiceOffering', asset: serviceOffering });
                }
            }

            if (item.labels.includes('ServiceAccessPoint') && item.value['host'] && item.value['port']) {
                if (!assetsMap.has(item.id)) {
                    const serviceAccessPoint: ServiceAccessPoint = {
                        id: item.id,
                        host: item.value['host'] as string,
                        openAPI: (item.value['openAPI'] as string) || '',
                        port:
                            typeof item.value['port'] === 'string'
                                ? parseInt(item.value['port'] as string, 10)
                                : (item.value['port'] as number),
                        protocol: (item.value['protocol'] as string) || '',
                        version: (item.value['version'] as string) || '',
                        description: (item.value['description'] as string[]) || [],
                    };
                    serviceCard.serviceAccessPoints?.push(serviceAccessPoint);
                    assetsMap.set(item.id, { id: item.id, type: 'ServiceAccessPoint', asset: serviceAccessPoint });
                }
            }

            if (item.labels.includes('PhysicalResource') && item.value['license'] && item.value['location']) {
                if (!assetsMap.has(item.id)) {
                    const physicalResource: PhysicalResource = {
                        id: item.id,
                        name: (item.value['name'] as string) || '',
                        description: (item.value['description'] as string[]) || [],
                        license: (item.value['license'] as string) || '',
                        location: (item.value['location'] as string) || '',
                        policy: (item.value['policy'] as string[]) || [],
                    };
                    serviceCard.physicalResources?.push(physicalResource);
                    assetsMap.set(item.id, { id: item.id, type: 'PhysicalResource', asset: physicalResource });
                }
            }

            if (item.labels.includes('DataResource')) {
                if (!assetsMap.has(item.id)) {
                    const dataResource: DataResource = {
                        id: item.id,
                        name: (item.value['name'] as string) || '',
                        description: (item.value['description'] as string[]) || [],
                        containsPII: (item.value['containsPII'] as string) || '',
                        copyrightOwnedBy: (item.value['copyrightOwnedBy'] as string) || '',
                        license: (item.value['license'] as string) || '',
                        policy: (item.value['policy'] as string) || '',
                    };
                    serviceCard.dataResources?.push(dataResource);
                    assetsMap.set(item.id, { id: item.id, type: 'DataResource', asset: dataResource });
                }
            }
        });

        const specificGroups2 = this.groupSpecificAssets(nodesToGroup);

        let groupId = 1;
        specificGroups2.forEach((group) => {
            Object.values(group).forEach((groupedNode) => {
                if (groupedNode) {
                    const asset = assetsMap.get(groupedNode.assetId);
                    if (asset) {
                        asset.asset.groupIds = asset.asset.groupIds || [];

                        if (!asset.asset.groupIds.includes(groupId)) {
                            asset.asset.groupIds.push(groupId);
                        }
                    }
                }
            });
            groupId++;
        });

        serviceCard.dataResources = this.expandResourcesByGroups(serviceCard.dataResources);
        serviceCard.serviceAccessPoints = this.expandResourcesByGroups(serviceCard.serviceAccessPoints);
        serviceCard.physicalResources = this.expandResourcesByGroups(serviceCard.physicalResources);
        return serviceCard;
    }

    private expandResourcesByGroups<T extends Resource>(
        resources: (T & { groupIds?: number[] })[] = [],
    ): (T & { groupIds?: number[] })[] {
        // expands resources with multiple group IDs into separate instances for each group
        const expanded: (T & { groupIds?: number[] })[] = [];
        resources.forEach((resource) => {
            if (resource.groupIds && resource.groupIds.length > 0) {
                resource.groupIds.forEach((groupId) => {
                    expanded.push({ ...resource, groupIds: [groupId] });
                });
            } else {
                expanded.push(resource);
            }
        });
        return expanded;
    }

    private groupSpecificAssets(assetsToGroup: AssetNode[]): Record<string, AssetNode | undefined>[] {
        // Group related assets
        const groups: Record<string, AssetNode | undefined>[] = [];

        const findLinkedAssets = (baseAsset: { assetId: number; linkedAssetId: number; assetLabel: string }) =>
            assetsToGroup.filter(
                (asset) => asset.assetId === baseAsset.linkedAssetId || asset.linkedAssetId === baseAsset.assetId,
            );

        assetsToGroup.forEach((baseAsset) => {
            const visited = new Set<number>();
            const currentGroup: Record<
                string,
                { assetId: number; linkedAssetId: number; assetLabel: string } | undefined
            > = {};

            const buildGroup = (asset: { assetId: number; linkedAssetId: number; assetLabel: string }) => {
                if (visited.has(asset.assetId)) return;
                visited.add(asset.assetId);
                currentGroup[asset.assetLabel] = asset;

                const linkedAssets = findLinkedAssets(asset);
                linkedAssets.forEach((linkedAsset) => buildGroup(linkedAsset));
            };

            buildGroup(baseAsset);

            const sortedGroup = Object.keys(currentGroup)
                .sort()
                .reduce((acc, label) => {
                    acc[label] = currentGroup[label];
                    return acc;
                }, {} as typeof currentGroup);

            if (!groups.some((group) => isEqual(group, sortedGroup))) {
                groups.push(sortedGroup);
            }
        });

        const filteredGroups = groups.filter((group, _, allGroups) => {
            const groupLabels = Object.keys(group).filter((key) => group[key] !== undefined);
            const groupSet = new Set(groupLabels);

            // Keep only the largest group of linked elements, remove subsets
            return !allGroups.some((otherGroup) => {
                const otherLabels = Object.keys(otherGroup).filter((key) => otherGroup[key] !== undefined);
                const otherSet = new Set(otherLabels);

                if (groupSet.size < otherSet.size && [...groupSet].every((label) => otherSet.has(label))) {
                    return true;
                }
                return false;
            });
        });

        return filteredGroups;
    }
}
