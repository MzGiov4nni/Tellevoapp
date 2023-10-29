import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  nombreUsuario!: string;
  id: number = 0;
  constructor(private route: ActivatedRoute, private supa: SupabaseApiService) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('hola grupo ' + this.id);
    });
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log(Usuario);
    this.nombreUsuario = Usuario.user_name;
  }


}
