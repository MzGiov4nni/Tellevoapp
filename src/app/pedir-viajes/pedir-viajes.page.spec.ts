import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedirViajesPage } from './pedir-viajes.page';

describe('PedirViajesPage', () => {
  let component: PedirViajesPage;
  let fixture: ComponentFixture<PedirViajesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PedirViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
