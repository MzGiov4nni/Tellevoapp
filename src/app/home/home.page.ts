import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';

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
  constructor(private router: Router) {}

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombreUsuario = usuario.nombre;
    }
    
    // Obtiene la ubicación y luego inicializa el mapa
    this.obtenerLatitudLongitud();
  }

  async obtenerLatitudLongitud() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitud = coordinates.coords.latitude;
      this.longitud = coordinates.coords.longitude;
      console.log('Latitud:', this.latitud);
      console.log('Longitud:', this.longitud);

      // Después de obtener la ubicación, inicializa el mapa
      this.initializeMap();
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitud, this.latitud], // Nota que se invierten latitud y longitud
      zoom: 16,
      accessToken: environment.mapboxToken,
    });
  }  
}

