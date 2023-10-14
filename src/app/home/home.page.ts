import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { Marker } from 'mapbox-gl'; // Importar la clase Marker

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nombreUsuario!: string;
  map!: mapboxgl.Map;
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = '';
  marcador: Marker = new Marker({ color: 'red' });  // Declarar una variable para el marcador

  constructor(private router: Router, private http: HttpClient) {}

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombreUsuario = usuario.nombre;
    }
    this.obtenerLatitudLongitud();
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
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitud, this.latitud],
      zoom: 15,
      accessToken: environment.mapboxToken,
    });

    // Crear y agregar un marcador
    this.marcador = new Marker()
      .setLngLat([this.longitud, this.latitud])
      .addTo(this.map);
  }

  obtenerNombreDeCalle() {
    const apiKey = environment.mapboxToken;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitud},${this.latitud}.json?access_token=${apiKey}`;

    this.http.get(url).subscribe(
      (response: any) => {
        if (response.features && response.features.length > 0) {
          this.direccion = response.features[0].place_name;
          console.log('Dirección:', this.direccion);
        } else {
          console.error('No se encontró una dirección válida para estas coordenadas.');
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud de geocodificación:', error);
      }
    );
  }
}
