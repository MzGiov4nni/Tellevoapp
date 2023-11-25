import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute,Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  // Declarar propiedades de la clase con sus valores iniciales
  nombreUsuario!: string;
  id: number = 0;
  direccion: string = '';
  celular: number = 0;
  private supabase;
  imageName: string = '';
  imageUrl: string = '';
  nombreFoto: string = '';

  constructor(
    private route: ActivatedRoute,
    private supa: SupabaseApiService,
    private toastController: ToastController,
    private router: Router,
  ) {
    const supabaseUrl = 'https://vgmnxcuuazgilywheivv.supabase.co'; // guardamos la URL en la variable 'supabaseUrl'
    // guardamos a apikey en la variable 'supabaseKey'
    const supabaseKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8';
    this.supabase = createClient(supabaseUrl, supabaseKey); // creamos el clientes para que haga los trabajos de la vase de datos
  }
  goToHome() {
    // Utiliza el Router para navegar a la ruta 'home' con el parámetro 'id'
    this.router.navigate(['/home', this.id]);
  }
  // esta funcion realizara todas los componetes cuando la pagina termina de cargar
  async ngOnInit() {
    // async para declarar una función asincrónica

    // El método subscribe se utiliza para suscribirse a este observable y escuchar los cambios en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      this.id = params['id']; //guardas el parametro en la variable 'id'
      console.log('hola grupo ' + this.id); // se muestra en consola
    });

    // Llama al método 'llamarUser' del servicio 'supa' y se guardan los datos en  la variable Usuario siendo llamado por su 'id'
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log(Usuario); // se muestra en consola

    // de la variable 'Usuario' solo sacamos el User_name y la guardamos en la variable 'nombreUsuario' que usamos en el HTML para mostrar el nombre del usuario
    this.nombreUsuario = Usuario.user_name;
    // de la variable 'Usuario' solo sacamos el celular y la guardamos en la variable 'celular' que usamos en el HTML para mostrar el nombre del usuario
    this.celular = Usuario.celular;
    // de la variable 'Usuario' solo sacamos el direccion y la guardamos en la variable 'direccion' que usamos en el HTML para mostrar el nombre del usuario
    this.direccion = Usuario.direccion;
    // de la variable 'Usuario' solo sacamos el foto y la guardamos en la variable 'nombreFoto' que usamos en el HTML para mostrar el nombre del usuario
    this.nombreFoto = Usuario.foto;

    //se llama la funcion con nombre 'cargarImagen'
    this.cargarImagen();
  }

  // Función asincrónica para subir un avatar desde un evento de selección de archivo
  async subirAvatar(event: any) {
    // Obtener el archivo seleccionado del evento
    const file = event.target.files[0];

    // Verificar si se seleccionó un archivo
    if (file) {
      this.imageName = file.name; // Almacena el nombre de la imagen en la variable 'imagenName'

      try {
        // Sube el archivo al buckets
        const { data, error } = await this.supabase.storage
          .from('ionic-fotos') // nombre del buckets
          .upload(this.imageName, file); // Subir el archivo con su nombre

        // Verificar si ocurrió un error durante la subida del archivo
        if (error) {
          console.error('Error al subir el archivo:', error); // se muestra en consola
        } else {
          // Si no hay error, mostrar un mensaje de éxito y subir la información del archivo a la base de datos
          console.log('Archivo subido con éxito:', data); // se muestra en consola

          // Llama al método 'subirFoto' del servicio 'supa' y se guardan los datos en  la variable imagenName siendo llamado por su 'id'
          this.supa.subirFoto(this.id, this.imageName);

          // se llama la funcion con nombre 'mostrarMensaje'
          this.mostrarMensaje();
        }
      } catch (error) {
        // Manejar errores en caso de una falla en la subida del archivo
        console.error('Error al subir el archivo:', error); // se muestra en consola
      }
    }
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

  // Función asincrónica para mostrar un mensaje tipo Toast
  async mostrarMensaje() {
    // Crear un Toast con el mensaje, duración y posición específicos
    const toast = await this.toastController.create({
      message: 'la foto se cambio exitosamente', // Mensaje que se mostrará
      duration: 2000, // Duración en milisegundos durante la cual se mostrará el mensaje (2 segundos en este caso)
      position: 'middle', // Posición del mensaje en la pantalla (centro en este caso)
    });

    // Mostrar el Toast en la interfaz
    toast.present();
  }
}
