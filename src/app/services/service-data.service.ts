import { Injectable } from '@angular/core';
import { NodeQueryResult, ServiceCard, Resource, DataResource } from '../types/dtos';

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

        items.forEach((item) => {
            if (item.labels.includes('LegalParticipant') && item.value['legalName']) {
                serviceCard.legalParticipant = {
                    id: item.id,
                    name: item.value['legalName'] as string,
                    description: (item.value['description'] as string[]) || [],
                };
            }

            if (item.labels.includes('legalRegistrationNumber')) {
                serviceCard.legalRegistrationNumber = {
                    id: item.id,
                    description: (item.value['description'] as string[]) || [],
                    vatID: (item.value['vatID'] as string) || '',
                    leiCode: (item.value['leiCode'] as string) || '',
                    countryCode:
                        (item.value['vatID-countryCode'] as string) ||
                        (item.value['leiCode-countryCode'] as string) ||
                        '',
                };
                serviceCard.legalRegistrationNumber['subdivisionCountryCode'] =
                    (item.value['vatID-subdivisionCountryCode'] as string) ||
                    (item.value['leiCode-subdivisionCountryCode'] as string) ||
                    '';
            }

            if (item.labels.includes('ServiceOffering') && item.value['name']) {
                serviceCard.serviceOffering = {
                    id: item.id,
                    name: item.value['name'] as string,
                    description: (item.value['description'] as string[]) || [],
                    policy: (item.value['policy'] as string[]) || [],
                };
            }

            if (item.labels.includes('ServiceAccessPoint') && item.value['host'] && item.value['port']) {
                const serviceAccessPoint = {
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
            }

            if (item.labels.includes('PhysicalResource') && item.value['license'] && item.value['location']) {
                const physicalResource = {
                    id: item.id,
                    name: (item.value['name'] as string) || '',
                    description: (item.value['description'] as string[]) || [],
                    license: (item.value['license'] as string) || '',
                    location: (item.value['location'] as string) || '',
                    policy: (item.value['policy'] as string[]) || [],
                };
                serviceCard.physicalResources?.push(physicalResource);
            }

            if (item.labels.includes('DataResource')) {
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
            }
        });

        return serviceCard;
    }
}
