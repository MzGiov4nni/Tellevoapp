import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pedir-viajes',
  templateUrl: './pedir-viajes.page.html',
  styleUrls: ['./pedir-viajes.page.scss'],
})
export class PedirViajesPage implements OnInit {
  datosDeViajes: any[] = [];
  id:number=0;
  nombreUsuario: string = '';
  idSeleccionado: number = 0;

  constructor(private supa: SupabaseApiService,private route: ActivatedRoute,private navCtrl: NavController) {}

  async ngOnInit() {
    this.supa.viajes().subscribe((data) => {
      this.datosDeViajes = data;
      console.log(this.datosDeViajes);
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('viajes '+this.id)
    });
  }
  /*sync estadoViaje(){
    const datosviajes = await lastValueFrom(this.supa.llamarViajes(this.idSeleccionado));
    const asientos = datosviajes.asientos
    if (asientos >= 1) {
      
      console.log('if no es cero')
      //this.cambiarEstado();
    }else{
      console.log('else es cero')
  
    }
  }*/
  async function () {
    const datosviajes = await lastValueFrom(this.supa.llamarViajes(this.idSeleccionado));
    console.log(datosviajes)
    const asientos = datosviajes.asientos
    console.log(asientos)
    const asientosbd = asientos - 1;
    console.log(asientosbd)
    if (asientosbd ===0) {
      
      console.log('if es 0')
      
      this.cambiarEstado();
      
    }else{
      console.log('else no es 0')
  
    }
    this.supa.modificarViaje(this.idSeleccionado, asientosbd).subscribe(
      (response) => {
        console.log('Datos modificados exitosamente:', response);
        
        
      },
      (error) => {
        console.error('Error al modificar datos:', error);
      }
    );

  }

  reloadPage() {
    this.navCtrl.navigateForward('/pedir-viajes');
  }
  cambiarEstado() {
    this.supa.cambiarEstado(this.idSeleccionado).subscribe(
      (response) => {
        console.log('Datos modificados exitosamente:', response);
        this.recargarPagina();
      },
      (error) => {
        console.error('Error al modificar datos:', error);
      }
    );
  }

  enviarId(id: number) {
    this.idSeleccionado = id;
    console.log('ID enviada al TypeScript:', this.idSeleccionado);
    //this.estadoViaje();

    this.function();
    

    /*const datosParaInsertar = {
      id_usuario: this.id,
      id_viajes: this.idSeleccionado,
      
    };

    
    this.supa.crearViaje(datosParaInsertar).subscribe(
      (response) => {
        console.log('Datos insertados exitosamente:', response);
      },
      (error) => {
        console.error('Error al insertar datos:', error);
      }
    );*/
  }
  
  recargarPagina() {
    window.location.reload();
  }
}
