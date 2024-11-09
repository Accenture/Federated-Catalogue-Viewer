export interface QueryResponse<T> {
    totalCount: number;
    items: T[];
}

export interface NodeQueryResult {
    id: number;
    value: Record<string, unknown>;
    labels: string[];
}

export const EMPTY_RESULTS: QueryResponse<NodeQueryResult> = {
    items: [],
    totalCount: 0,
};

export interface Resource {
    id: number;
    name?: string;
    description?: string[];
}

export interface ServiceOffering extends Resource {
    policy?: string[];
}

export interface LegalRegistrationNumber extends Resource {
    countryCode: string;
    vatID?: string;
    leiCode?: string;
    subdivisionCountryCode?: string;
}

export interface ServiceAccessPoint extends Resource {
    host: string;
    openAPI: string;
    port: number;
    protocol: string;
    version: string;
}

export interface PhysicalResource extends Resource {
    license: string;
    location: string;
    policy: string[];
}

export interface DataResource extends Resource {
    containsPII: string;
    copyrightOwnedBy: string;
    license: string;
    policy: string;
}

export interface ServiceCard {
    legalParticipant: Resource;
    legalRegistrationNumber: LegalRegistrationNumber;
    serviceOffering: ServiceOffering;
    serviceAccessPoints?: ServiceAccessPoint[];
    physicalResources?: PhysicalResource[];
    dataResources?: DataResource[];
}

export interface ServiceOfferingNodes {
    data: QueryResponse<NodeQueryResult>;
    offer: Resource;
}
