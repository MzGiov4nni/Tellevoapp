import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import { createClient } from '@supabase/supabase-js';
import {  Renderer2, ElementRef } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // Declarar propiedades de la clase con sus valores iniciales
  nombreUsuario: string ='';
  id:number=0;
  map!: mapboxgl.Map;
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = ''; 
  private supabase;
  imageUrl: string = '';
  nombreFoto: string='';

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private supa: SupabaseApiService,private renderer: Renderer2, private el: ElementRef ) {    // Configuración de Supabase para llamarlo con js o ts pero solo lo usamos aqui todas las otras formas son por otro
    const supabaseUrl = 'https://vgmnxcuuazgilywheivv.supabase.co'; // guardamos la URL en la variable 'supabaseUrl'
    // guardamos a apikey en la variable 'supabaseKey'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8';
    this.supabase = createClient(supabaseUrl, supabaseKey); // creamos el clientes para que haga los trabajos de la vase de datos
}
  
  
  // Función para navegar a la página de pedir viajes 
  goToviajes() {
    // Utiliza el Router para navegar a la ruta 'pedir-viajes' con el parámetro 'id'
    this.router.navigate(['/pedir-viajes',{id:this.id}]);
  }

  // Función para navegar a la página de perfil 
  goToPerfil() {
    // Utiliza el Router para navegar a la ruta 'perfil' con el parámetro 'id'
    this.router.navigate(['/perfil',{id:this.id}]);
  }

  // Función para navegar a la página de crear viajes 
  goTocrearViajes() {
    // Utiliza el Router para navegar a la ruta 'crear-viaje' con el parámetro 'id'
    this.router.navigate(['/crear-viaje',{id:this.id}]);
  }

  // Función para navegar a la página de inicio de sesión 
  goToLogin() {
    // Utiliza el Router para navegar a la ruta 'login'
    this.router.navigate(['/login']);
  }

   // esta funcion realizara todas los componetes cuando la pagina termina de cargar 
  async ngOnInit() { // async para declarar una función asincrónica

    // El método subscribe se utiliza para suscribirse a este observable y escuchar los cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id'];  //guardas el parametro en la variable 'id'
      console.log('hola usuario '+this.id) //se muestra en la consola
    });

    // se llama la funcion llamada 'obtenerLatitudLongitud'
    this.obtenerLatitudLongitud();

    // Llama al método 'llamarUser' del servicio 'supa' y se guardan los datos en  la variable Usuario siendo llamado por su 'id'
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log(Usuario) //se muestra en la consola
    // de la variable Usuario solo sacamos el User_name y la guardamos en la variable 'nombreUsuario' que usamos en el HTML para mostrar el nombre del usuario 
    this.nombreUsuario = Usuario.user_name; 
    // de la variable 'Usuario' solo sacamos el foto y la guardamos en la variable 'nombreFoto' que usamos en el HTML para mostrar el nombre del usuario
    this.nombreFoto = Usuario.foto;

    //se llama la funcion con nombre 'cargarImagen'
    this.cargarImagen()
  }

  // Función para obtener la latitud y longitud de la ubicación actual
  async obtenerLatitudLongitud() { // async para declarar una función asincrónica
    try {

      // en la variable 'coordinates' se guarda los datos que trae la libreria de geolocation de ionic 
      const coordinates = await Geolocation.getCurrentPosition();
      
      // en la variable latitud se guarda el dato de latitud sacado de la variable'coordinates'
      this.latitud = coordinates.coords.latitude;
      // en la variable longitud se guarda el dato de longitud sacado de la variable'coordinates'
      this.longitud = coordinates.coords.longitude;
      
      console.log('Latitud:', this.latitud); //se muestra en la consola
      console.log('Longitud:', this.longitud); //se muestra en la consola

      // se llama la funcion llamada 'obtenerNombreDeCalle'
      this.obtenerNombreDeCalle();

      // se llama la funcion llamada 'initializeMap'
      this.initializeMap();

    } catch (error) {
      // si da algun error se mostrara en consola el error
      console.error('Error al obtener la ubicación:', error);
    }
  }

  // Función para inicializar el mapa
  initializeMap() {
    //si hay una variable llamada 'map' entrar al if y se rellena con los siguientes datos 
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: 'map',  // ID del contenedor HTML donde se mostrará el mapa
        style: 'mapbox://styles/mapbox/streets-v11',  // Estilo del mapa (los estilos ya los trae mapbox)
        center: [this.longitud, this.latitud], // Centro del mapa usammos las variables 'longitud' y 'latitud' para que el mapa muestre nuestra ubicación
        zoom: 15, // Nivel de zoom que comieza el mapa 
        accessToken: environment.mapboxToken,  // Token de acceso de Mapbox traido desde 'environment'
      });
    }
  }

   // Función para obtener el nombre de la calle a partir de las coordenadas
  obtenerNombreDeCalle() {
    const apiKey = environment.mapboxToken; // Token de acceso de Mapbox traido desde 'environment'
    // Construir la URL para la solicitud de geocodificación primero ponemos 'longitud' luego 'latitud' y al final la 'apiKey'
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitud},${this.latitud}.json?access_token=${apiKey}`;

    // Realizar una solicitud HTTP GET a la URL construida
    this.http.get(url).subscribe((response: any) => {

       // Comprobar si la respuesta contiene características geográficas y si hay al menos una
      if (response.features && response.features.length > 0) {

         // Asignar el nombre de la calle (place_name) desde la primera característica a la variable 'direccion'
        this.direccion = response.features[0].place_name;

        console.log('Dirección:', this.direccion); //se muestra en la consola
      
      } else {

        // Si no se encuentra una dirección válida, registrar un mensaje de error
        console.error('No se encontró una dirección válida para estas coordenadas.');
      }
    }, (error) => {

       // En caso de error en la solicitud, registrar un mensaje de error
      console.error('Error al realizar la solicitud de geocodificación:', error);
    });
  }

  // Función asincrónica para cargar una imagen
  async  cargarImagen() {

    const bucketName = 'ionic-fotos'; // Nombre del contenedor de almacenamiento
    const fileName = this.nombreFoto; // Nombre del archivo de imagen a cargar
    const expira = 60 * 60 * 24 * 60; // Genera una URL firmada válida por 2 meses (60 días)
    // Utilizar el servicio de almacenamiento de Supabase
    this.supabase.storage
      .from(bucketName) // Acceder al contenedor de almacenamiento
      .createSignedUrl(fileName, expira) // Crear una URL firmada válida por 3600 segundos (1 hora)
      .then(({ data, error }) => {
        
        if (error) {
           // Si ocurre un error, mostrar un mensaje de error en la consola
          console.error('Error al obtener la URL de la imagen', error); // se muestra en consola
        } else {
          // Si no hay error, asignar la URL firmada de la imagen a la variable 'imageUrl'
          this.imageUrl = data.signedUrl;
        }
      });
  }
}