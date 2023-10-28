import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';

@Component({
  selector: 'app-pedir-viajes',
  templateUrl: './pedir-viajes.page.html',
  styleUrls: ['./pedir-viajes.page.scss'],
})
export class PedirViajesPage implements OnInit {
  datosDeViajes: any[] = [];
  idChofer: number = 0;
  nombreUsuario: string = '';

  constructor(private supa: SupabaseApiService) {}

  async ngOnInit() {
    this.supa.viajes().subscribe((data) => {
      this.datosDeViajes = data;
      console.log(this.datosDeViajes);

    });

  }


}
