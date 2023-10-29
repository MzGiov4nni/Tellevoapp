import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearViajePage } from './crear-viaje.page';

describe('CrearViajePage', () => {
  let component: CrearViajePage;
  let fixture: ComponentFixture<CrearViajePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
