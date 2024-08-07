import { Observable, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';

import { ITechnologies } from '@core/models/technologies.interface';

import { environment } from '@layout/environments/environment.development';

import { FirebaseService } from '@core/service/local-storage/firebase.service';

import { TechnologiesComponent } from './technologies.component';

describe('TechnologiesComponent', () => {
    let component: TechnologiesComponent;
    let fixture: ComponentFixture<TechnologiesComponent>;
    let firebaseService: FirebaseService;

    // Мокаем данные для тестирования с новым интерфейсом
    const mockBackendTech: ITechnologies[] = [
        {
            alt: 'Node.js logo',
            iconPath: 'nodejs.png',
            id: 'nodejs',
            link: 'https://nodejs.org/en/',
            technologyName: 'Node.js',
        },
        {
            alt: 'Express logo',
            iconPath: 'express.png',
            id: 'express',
            link: 'https://expressjs.com/',
            technologyName: 'Express',
        },
        {
            alt: 'MongoDB logo',
            iconPath: 'mongodb.png',
            id: 'mongodb',
            link: 'https://www.mongodb.com/',
            technologyName: 'MongoDB',
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TechnologiesComponent],
            providers: [
                // Используем реальный сервис, но мокируем его метод
                FirebaseService,
            ],
            imports: [
                AngularFireModule.initializeApp(environment.firebase),
                TechnologiesComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TechnologiesComponent);
        component = fixture.componentInstance;
        firebaseService = TestBed.inject(FirebaseService);
        // Используем spyOn, чтобы стабить метод getBackendTech и вернуть моковые данные
        spyOn(firebaseService, 'getBackendTech').and.returnValue(
            of(mockBackendTech),
        );
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have currentTab as an input property', () => {
        expect(component.currentTab).toBeDefined();
    });

    it('should have backendTech$ as an observable property', () => {
        expect(component.backendTech$).toBeInstanceOf(Observable);
    });

    it('should call getBackendTech method of firebaseService on init', () => {
        expect(firebaseService.getBackendTech).toHaveBeenCalled();
    });

    it('should render technology cards for each backend technology', () => {
        const technologyCards =
            fixture.nativeElement.querySelectorAll('.technology-card');
        expect(technologyCards.length).toEqual(mockBackendTech.length);
        for (let i = 0; i < technologyCards.length; i++) {
            const technologyCard = technologyCards[i];
            const technology = mockBackendTech[i];
            expect(
                technologyCard.querySelector('.technology-name').textContent,
            ).toContain(technology.technologyName);
            expect(
                technologyCard.querySelector('.technology-logo').src,
            ).toContain(technology.iconPath);
            expect(
                technologyCard.querySelector('.technology-logo').alt,
            ).toContain(technology.alt);
            expect(
                technologyCard.querySelector('.technology-link').href,
            ).toContain(technology.link);
        }
    });
});
