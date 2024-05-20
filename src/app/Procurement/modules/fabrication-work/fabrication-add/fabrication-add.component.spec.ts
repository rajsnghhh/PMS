import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricationAddComponent } from './fabrication-add.component';

describe('FabricationAddComponent', () => {
  let component: FabricationAddComponent;
  let fixture: ComponentFixture<FabricationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabricationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
