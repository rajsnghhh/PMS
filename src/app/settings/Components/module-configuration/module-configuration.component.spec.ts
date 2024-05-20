import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleConfigurationComponent } from './module-configuration.component';

describe('ModuleConfigurationComponent', () => {
  let component: ModuleConfigurationComponent;
  let fixture: ComponentFixture<ModuleConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
