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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // Declarar propiedades de la clase con sus valores iniciales
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
  private map!: mapboxgl.Map; 

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private supa: SupabaseApiService,
    private navCtrl: NavController,
    private router: Router,
    
  ) {
    // Configuración de Supabase para llamarlo con js o ts pero solo lo usamos aqui todas las otras formas son por otro
    const supabaseUrl = 'https://vgmnxcuuazgilywheivv.supabase.co'; // guardamos la URL en la variable 'supabaseUrl'
    // guardamos a apikey en la variable 'supabaseKey'
    const supabaseKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8';
    this.supabase = createClient(supabaseUrl, supabaseKey); // creamos el clientes para que haga los trabajos de la vase de datos
  }

  async goToPedir_viaje() {
    this.router.navigate(['/pedir-viajes', this.id]);
  }

  async goToPerfil() {
    this.navCtrl.navigateForward(['/perfil', { id: this.id }]);
  }

  async goTocrearViajes() {
    this.navCtrl.navigateForward(['/crear-viaje', { id: this.id }]);
  }

  async goToLogin() {
    this.navCtrl.navigateForward(['/login']);

  }

  async ngOnDestroy() {
  }
  
  // esta funcion realizara todas los componetes cuando la pagina termina de cargar
  async ngOnInit() {
    this.obtenerLatitudLongitud();
    // async para declarar una función asincrónica
    // El método subscribe se utiliza para suscribirse a este observable y escuchar los cambios en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      this.id = params['id']; //guardas el parametro en la variable 'id'
      console.log('hola usuario ' + this.id); //se muestra en la consola
    });

    // se llama la funcion llamada 'solicitarPermisos'
    this.solicitarPermisos();

    // se llama la funcion llamada 'obtenerLatitudLongitud'

    // Llama al método 'llamarUser' del servicio 'supa' y se guardan los datos en  la variable Usuario siendo llamado por su 'id'
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log(Usuario); //se muestra en la consola
    // de la variable Usuario solo sacamos el User_name y la guardamos en la variable 'nombreUsuario' que usamos en el HTML para mostrar el nombre del usuario
    this.nombreUsuario = Usuario.user_name;
    // de la variable 'Usuario' solo sacamos el foto y la guardamos en la variable 'nombreFoto' que usamos en el HTML para mostrar el nombre del usuario
    this.nombreFoto = Usuario.foto;

    this.cargarImagen();

    const datos_viajes_alumnos = await lastValueFrom(this.supa.datosParaMapa(this.id));
    console.log(datos_viajes_alumnos);
    if (!datos_viajes_alumnos) {
      console.log('12')
      this.id_viajes = 0;
      this.initializeMap();
    } else {
      console.log('13')
      this.id_viajes = datos_viajes_alumnos.id_viajes;
      console.log(this.id_viajes);

      const datos_del_viaje = await lastValueFrom(this.supa.datos_de_viaje(this.id_viajes));
      this.latitud_bd = datos_del_viaje.latitud
      this.longitud_bd = datos_del_viaje.longitud
      console.log(datos_del_viaje)
      console.log('longitud ' + this.longitud_bd)
      console.log('latitud ' + this.latitud_bd)
      this.initializeMap();
    }

  }
  // Función para obtener la latitud y longitud de la ubicación actual
  async obtenerLatitudLongitud() {
    // async para declarar una función asincrónica
    try {
      // en la variable 'coordinates' se guarda los datos que trae la libreria de geolocation de ionic
      const coordinates = await Geolocation.getCurrentPosition();

      // en la variable latitud se guarda el dato de latitud sacado de la variable'coordinates'
      this.latitud_presisa = coordinates.coords.latitude;
      // en la variable longitud se guarda el dato de longitud sacado de la variable'coordinates'
      this.longitud_presisa = coordinates.coords.longitude;

      console.log('Latitud:', this.latitud_presisa); //se muestra en la consola
      console.log('Longitud:', this.longitud_presisa); //se muestra en la consola

      // se llama la funcion llamada 'obtenerNombreDeCalle'
      this.obtenerNombreDeCalle();

      // se llama la funcion llamada 'initializeMap'

    } catch (error) {
      // si da algun error se mostrara en consola el error
      console.error('Error al obtener la ubicación:', error);
    }
  }

  // Función para inicializar el mapa utilizando la biblioteca Mapbox
 
  // Función para inicializar el mapa utilizando la biblioteca Mapbox
  async initializeMap() {
    if (this.map) {
      this.map.remove();
    }
    if (!this.map) {
      console.log('entro al primer if de creacion de mapa');

      this.map = new mapboxgl.Map({
        container: 'map', // ID del contenedor HTML donde se mostrará el mapa
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.longitud_presisa, this.latitud_presisa],
        zoom: 15,
        accessToken: environment.mapboxToken,
      });

      console.log('paso los datos del mapa ');
      console.log('Valor de id_viajes:', this.id_viajes);

      if (this.id_viajes !== 0) {
        console.log('Entró al bloque if de id_viajes diferente a 0');
        this.map.on('load', () => {
          // Colocar marcadores en el mapa después de que se haya cargado completamente
          const coordenadasMarcador1: mapboxgl.LngLatLike = [
            this.longitud_presisa,
            this.latitud_presisa,
          ];
          const coordenadasMarcador2: mapboxgl.LngLatLike = [
            this.longitud_bd,
            this.latitud_bd,
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
      } else {
        console.log('Entró al bloque else de id_viaje diferente a 0');
      }
    }
  }


  // Función para obtener el nombre de la calle a partir de las coordenadas
  obtenerNombreDeCalle() {
    const apiKey = environment.mapboxToken; // Token de acceso de Mapbox traido desde 'environment'
    // Construir la URL para la solicitud de geocodificación primero ponemos 'longitud' luego 'latitud' y al final la 'apiKey'
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitud_presisa},${this.latitud_presisa}.json?access_token=${apiKey}`;

    // Realizar una solicitud HTTP GET a la URL construida
    this.http.get(url).subscribe(
      (response: any) => {
        // Comprobar si la respuesta contiene características geográficas y si hay al menos una
        if (response.features && response.features.length > 0) {
          // Asignar el nombre de la calle (place_name) desde la primera característica a la variable 'direccion'
          this.direccion = response.features[0].place_name;

          console.log('Dirección:', this.direccion); //se muestra en la consola
        } else {
          // Si no se encuentra una dirección válida, registrar un mensaje de error
          console.error(
            'No se encontró una dirección válida para estas coordenadas.'
          );
        }
      },
      (error) => {
        // En caso de error en la solicitud, registrar un mensaje de error
        console.error(
          'Error al realizar la solicitud de geocodificación:',
          error
        );
      }
    );
  }

  // Función asincrónica para cargar una imagen
  async cargarImagen() {
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
  async solicitarPermisos() {
    const result = await Geolocation.requestPermissions();
    if (result.location === 'granted') {
      // Permiso concedido, puedes obtener la ubicación.
      this.obtenerLatitudLongitud();
    } else {
      // Permiso denegado, manejar según sea necesario.
      console.log('Permiso de ubicación denegado');
    }
  }

}
