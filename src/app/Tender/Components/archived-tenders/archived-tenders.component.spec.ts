import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedTendersComponent } from './archived-tenders.component';

describe('ArchivedTendersComponent', () => {
  let component: ArchivedTendersComponent;
  let fixture: ComponentFixture<ArchivedTendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedTendersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedTendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
