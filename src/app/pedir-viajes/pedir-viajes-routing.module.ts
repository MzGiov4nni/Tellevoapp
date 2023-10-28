import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedirViajesPage } from './pedir-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: PedirViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedirViajesPageRoutingModule {}
