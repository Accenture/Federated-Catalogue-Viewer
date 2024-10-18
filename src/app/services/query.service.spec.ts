import { TestBed } from '@angular/core/testing';

import { QueryService } from './query.service';
import { TestingModule } from '../testing.module';

describe('QueryService', () => {
    let service: QueryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestingModule],
        });
        service = TestBed.inject(QueryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
