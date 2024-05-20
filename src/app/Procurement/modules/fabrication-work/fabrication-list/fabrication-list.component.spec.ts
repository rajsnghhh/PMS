import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricationListComponent } from './fabrication-list.component';

describe('FabricationListComponent', () => {
  let component: FabricationListComponent;
  let fixture: ComponentFixture<FabricationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabricationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
