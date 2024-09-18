import { Observable, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ITechnologies } from '@core/models/technologies.interface';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectBackendTech } from '@layout/store/firebase-store/firebase.selectors';

import { environment } from '@env/environment.development';

import { TechnologiesComponent } from './technologies.component';

describe('TechnologiesComponent', () => {
    let component: TechnologiesComponent;
    let fixture: ComponentFixture<TechnologiesComponent>;
    let store: MockStore;

    // Мокаем данные для тестирования с новым интерфейсом
    const mockBackendTech: ITechnologies[] = [
        {
            alt: 'Node.js logo',
            iconPath: 'nodejs.png',
            id: 'nodejs',
            link: 'https://nodejs.org/en/',
            technologyName: 'Node.js',
            imgName: 'nodejs.png',
        },
        {
            alt: 'Express logo',
            iconPath: 'express.png',
            id: 'express',
            link: 'https://expressjs.com/',
            technologyName: 'Express',
            imgName: 'express.png',
        },
        {
            alt: 'MongoDB logo',
            iconPath: 'mongodb.png',
            id: 'mongodb',
            link: 'https://www.mongodb.com/',
            technologyName: 'MongoDB',
            imgName: 'mongodb.png',
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TechnologiesComponent],
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: selectBackendTech,
                            value: of(mockBackendTech),
                        },
                    ],
                }),
            ],
            imports: [AngularFireModule.initializeApp(environment.firebase)],
        }).compileComponents();

        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TechnologiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have backendTech$ as an observable property', () => {
        expect(component.backendTech$).toBeInstanceOf(Observable);
    });

    it('should call getBackendTech method of firebaseService on init', () => {
        spyOn(store, 'dispatch');
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalledWith(
            FirebaseActions.getBackendTech({
                imgName: 'technologies/backend',
            }),
        );
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
