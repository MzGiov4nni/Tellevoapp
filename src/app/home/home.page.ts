import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import { createClient } from '@supabase/supabase-js';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nombreUsuario: string = '';
  id: number = 0;
  latitud_presisa: number = 0;
  longitud_presisa: number = 0;
  direccion: string = '';
  private supabase;
  imageUrl: string = '';
  nombreFoto: string = '';
  id_viajes: number = 0;
  latitud_bd: number = 0;
  longitud_bd: number = 0;
  num: number = 0;
  private map: mapboxgl.Map | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private supa: SupabaseApiService,
    private navCtrl: NavController,
    private router: Router,
    private toastController: ToastController
  ) {
    const supabaseUrl = 'https://vgmnxcuuazgilywheivv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async goToPedir_viaje() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  
    this.router.navigate(['/pedir-viajes', this.id]);
  }

  async goToPerfil() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.navCtrl.navigateForward(['/perfil', { id: this.id }]);
  }

  async goTocrearViajes() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.navCtrl.navigateForward(['/crear-viaje', { id: this.id }]);
  }

  async goToLogin() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
      
    this.navCtrl.navigateForward(['/login']);
  }

  eliminar(){
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
  async ngOnDestroy() {
  }
  
  async ngOnInit() {
    this.obtenerLatitudLongitud();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.solicitarPermisos();

    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    this.nombreUsuario = Usuario.user_name;
    this.nombreFoto = Usuario.foto;

    this.cargarImagen();

    const datos_viajes_alumnos = await lastValueFrom(this.supa.datosParaMapa(this.id));
    if (!datos_viajes_alumnos) {
      this.id_viajes = 0;
    } else {
      this.id_viajes = datos_viajes_alumnos.id_viajes;

      const datos_del_viaje = await lastValueFrom(this.supa.datos_de_viaje(this.id_viajes));
      this.latitud_bd = datos_del_viaje.latitud;
      this.longitud_bd = datos_del_viaje.longitud;
      
    }
    
  }

  async obtenerLatitudLongitud() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitud_presisa = coordinates.coords.latitude;
      this.longitud_presisa = coordinates.coords.longitude;

      this.obtenerNombreDeCalle();

    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  async crearMapa() {
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.longitud_presisa, this.latitud_presisa],
        zoom: 15,
        accessToken: environment.mapboxToken,
      });
    } else {
      this.ya_mapa()
    }
  }

  obtenerNombreDeCalle() {
    const apiKey = environment.mapboxToken;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitud_presisa},${this.latitud_presisa}.json?access_token=${apiKey}`;

    this.http.get(url).subscribe(
      (response: any) => {
        if (response.features && response.features.length > 0) {
          this.direccion = response.features[0].place_name;
        } else {
          console.error('No se encontró una dirección válida para estas coordenadas.');
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud de geocodificación:', error);
      }
    );
  }

  async cargarImagen() {
    const bucketName = 'ionic-fotos'; 
    const fileName = this.nombreFoto; 
    const expira = 60 * 60 * 24 * 60; 
    this.supabase.storage
      .from(bucketName) 
      .createSignedUrl(fileName, expira) 
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al obtener la URL de la imagen', error); 
        } else {
          this.imageUrl = data.signedUrl;
        }
      });
  }
  async solicitarPermisos() {
    const result = await Geolocation.requestPermissions();
    if (result.location === 'granted') {
      this.obtenerLatitudLongitud();
    } else {
      console.log('Permiso de ubicación denegado');
    }
  }
  async ya_mapa() {
    const toast = await this.toastController.create({
      message: 'Ya hay un mapa creado',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }
}
