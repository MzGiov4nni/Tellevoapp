import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {
  id:number=0;
  asientos: number=0;
  destino: string='';
  hora_ini: string='';
  estado_viaje: boolean = true;
  id_chofer: number = 0;
  constructor(private route: ActivatedRoute, private supa: SupabaseApiService,private router: Router,private formBuilder: FormBuilder) {
  }
  goToHome(){
    this.router.navigate(['/home',this.id]);
  }
  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('hola grupo ' + this.id);
    });
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log(Usuario);
    this.id_chofer = this.id
  }

  subirDato() {
    if (this.asientos && this.destino && this.hora_ini && this.id_chofer) {
      const datos_recibidos = {
        asientos: this.asientos,
        destino: this.destino,
        hora_ini: this.hora_ini,
        estado_viaje: this.estado_viaje,
        id_chofer: this.id_chofer,
      };
      
      this.supa.crearViajeCero(datos_recibidos).subscribe(
        (response) => {
          console.log('Datos subidos exitosamente', response);
        },
        (error) => {
          console.error('Error al subir datos', error);
        }
      );
    }
  }
}