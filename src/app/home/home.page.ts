import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nombreUsuario!: string; // Propiedad para almacenar el nombre del usuario
  map!: mapboxgl.Map;

  constructor(private router: Router) {}

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  ngOnInit() {
    // Recuperar los datos del usuario desde el Local Storage
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombreUsuario = usuario.nombre;
    }

    // Configurar el token de acceso al crear el mapa
    this.initializeMap();
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
      accessToken: environment.mapboxToken, // Configura el token aquí
    });
  }
}
