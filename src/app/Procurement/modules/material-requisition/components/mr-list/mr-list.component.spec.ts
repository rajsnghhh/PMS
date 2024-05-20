import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrListComponent } from './mr-list.component';

describe('MrListComponent', () => {
  let component: MrListComponent;
  let fixture: ComponentFixture<MrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
