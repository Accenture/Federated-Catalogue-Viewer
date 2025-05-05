import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceCardComponent } from './service-card.component';
import { ServiceCard } from '../../types/dtos';

describe('ServiceCardComponent', () => {
    let component: ServiceCardComponent;
    let fixture: ComponentFixture<ServiceCardComponent>;

    const mockService: ServiceCard = {
        legalParticipant: {
            id: 1,
            name: 'Participant',
        },
        legalRegistrationNumber: {
            id: 1,
            countryCode: 'de',
        },
        serviceOffering: {
            id: 1,
            name: 'Service Offering',
            description: ['A description'],
        },
        serviceAccessPoints: [],
        physicalResources: [],
        dataResources: [],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceCardComponent);
        component = fixture.componentInstance;
        component.service = mockService;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
