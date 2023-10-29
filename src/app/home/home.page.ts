import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  nombreUsuario: string ='';
  id:number=0;
  map!: mapboxgl.Map;
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = ''; 

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private supa: SupabaseApiService ) {}
  goToviajes() {
    this.router.navigate(['/pedir-viajes',{id:this.id}]);
  }
  goToPerfil() {
    this.router.navigate(['/perfil',{id:this.id}]);
  }
  goTocrearViajes() {
    this.router.navigate(['/crear-viaje',{id:this.id}]);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  
  async ngOnInit() {
    this.obtenerLatitudLongitud();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('hola grupo '+this.id)
    });
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log('id fuera '+ this.id)
    console.log(Usuario)
    this.nombreUsuario = Usuario.user_name;
  }
  ngOnDestroy() {
    if (this.map) {
      this.map.remove(); 
    }
  }
  async obtenerLatitudLongitud() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitud = coordinates.coords.latitude;
      this.longitud = coordinates.coords.longitude;
      console.log('Latitud:', this.latitud);
      console.log('Longitud:', this.longitud);

      this.obtenerNombreDeCalle();
      this.initializeMap();
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  initializeMap() {
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.longitud, this.latitud],
        zoom: 15,
        accessToken: environment.mapboxToken,
      });
    }
  }

  obtenerNombreDeCalle() {
    const apiKey = environment.mapboxToken;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitud},${this.latitud}.json?access_token=${apiKey}`;

    this.http.get(url).subscribe((response: any) => {
      if (response.features && response.features.length > 0) {
        this.direccion = response.features[0].place_name;
        console.log('Dirección:', this.direccion);
      } else {
        console.error('No se encontró una dirección válida para estas coordenadas.');
      }
    }, (error) => {
      console.error('Error al realizar la solicitud de geocodificación:', error);
    });
  }
}