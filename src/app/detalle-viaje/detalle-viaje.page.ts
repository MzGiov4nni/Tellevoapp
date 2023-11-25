import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit, OnDestroy {
  id: number = 0;
  id_viaje: number = 0;

  asiento: number = 0;
  destino: string = '';
  hora_ini: string = '';
  estado_viaje: string = '';
  nombre_chofer: string = '';
  id_chofer: number = 0;
  latitud: number = 0;
  longitud:number = 0;
 
  map!: mapboxgl.Map;

  constructor(
    private supa: SupabaseApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) { }



  async goToPedir_viaje() {
    if(this.map){this.map.remove()}
    
    this.router.navigate(['/pedir-viajes', this.id]);
  }

  async ngOnDestroy() {

  }

eliminar(){
  this.map.remove()
}
  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.id = params['id_user'];
      this.id_viaje = params['idSeleccionado'];
    });

    this.sacar_datos();

    
  }
  async initializeMap() {
      this.map = new mapboxgl.Map({
        container: 'map_detalle',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-71.53300258986857, -33.033468476876834],
        zoom: 16,
        accessToken: environment.mapboxToken,
      });

      this.map.on('load', () => {
        // Colocar marcadores en el mapa después de que se haya cargado completamente
        const coordenadasMarcador1: mapboxgl.LngLatLike = [
          -71.53300258986857,
          -33.033468476876834,
        ];
        const coordenadasMarcador2: mapboxgl.LngLatLike = [
          this.longitud,
          this.latitud,
        ];
        this.map.addSource('line-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [coordenadasMarcador1, coordenadasMarcador2],
            },
          },
        });
        this.map.addLayer({
          id: 'line-layer',
          type: 'line',
          source: 'line-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#888',
            'line-width': 8,
          },
        });
      });
  }

  async sacar_datos() {
    const datos_del_viaje = await lastValueFrom(this.supa.datos_de_viaje(this.id_viaje));

    this.id_chofer = datos_del_viaje.id_chofer;
    const estado = datos_del_viaje.estado_viaje;

    this.destino = datos_del_viaje.destino;
    this.hora_ini = datos_del_viaje.hora_ini;
    this.asiento = datos_del_viaje.asiento;
    this.latitud = datos_del_viaje.latitud
    this.longitud = datos_del_viaje.longitud

    if (estado === true) {
      this.estado_viaje = 'esperando pasajeros ';
    } else {
      this.estado_viaje = 'el viaje está en curso';
    }

    const datos_del_usuario = await lastValueFrom(this.supa.llamarUser(this.id_chofer));
    console.log(datos_del_usuario);
    this.nombre_chofer = datos_del_usuario.user_name;
  }

  asientos_funcion() {
    const asiento_BD_subir = this.asiento - 1;
    if (asiento_BD_subir === 0) {
      console.log('if es 0');
      this.cambiarEstado();
    } else {
      console.log('else no es 0');
    }
    this.supa.modificarViaje(this.id_viaje, asiento_BD_subir).subscribe(
      (response) => {
        console.log('Datos modificados exitosamente:', response);
      },
      (error) => {
        console.error('Error al modificar datos:', error);
      }
    );
  }

  cambiarEstado() {
    this.supa.cambiarEstado(this.id_viaje).subscribe(
      (response) => {
        console.log('Datos modificados exitosamente:', response);
        this.recargarPagina();
      },
      (error) => {
        console.error('Error al modificar datos:', error);
      }
    );
  }

  async verificar_pasajero() {
    this.id
    this.id_viaje

    const pasajero = await lastValueFrom(this.supa.eresPasajero(this.id, this.id_viaje));
    console.log(pasajero);

    const Viaje_alumnos = await lastValueFrom(this.supa.datosParaMapa(this.id))
    console.log(Viaje_alumnos)

    if (this.id_chofer.toString() === this.id.toString()) {
      this.eres_chofer();
    } else {
      if (!pasajero) {
        if (!Viaje_alumnos) {
          this.asientos_funcion();

          this.noeresPasajero();

          const datosParaInsertar = {
            id_usuario: this.id,
            id_viajes: this.id_viaje,
          };
          this.supa.crearViaje(datosParaInsertar).subscribe(
            (response) => {
              console.log('Datos insertados exitosamente:', response);
              this.recargarPagina();
            },
            (error) => {
              console.error('Error al insertar datos:', error);
            }
          );
        } else {
          this.ya_tienes_viaje();
        }
      } else {
        this.eresPasajero();
      }
    }
  }
  
  recargarPagina() {
    window.location.reload();
  }


  async eresPasajero() {
    const toast = await this.toastController.create({
      message: 'ya eres pasajero en este viaje',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }


  async noeresPasajero() {
    const toast = await this.toastController.create({
      message: 'has apartado un asiento en ese viaje',
      duration: 2000,
      position: 'middle',
    });

    toast.present();
  }

  async eres_chofer() {
    const toast = await this.toastController.create({
      message: 'eres el chofer de este viaje',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }
  async ya_tienes_viaje() {
    const toast = await this.toastController.create({
      message: 'ya estas abordo de un viaje',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }


}