import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedirViajesPageRoutingModule } from './pedir-viajes-routing.module';

import { PedirViajesPage } from './pedir-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedirViajesPageRoutingModule
  ],
  declarations: [PedirViajesPage]
})
export class PedirViajesPageModule {}
