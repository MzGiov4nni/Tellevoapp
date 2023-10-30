import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {
  // Declarar propiedades de la clase con sus valores iniciales
  id:number=0;
  asientos: number=0;
  destino: string='';
  hora_ini: string='';
  estado_viaje: boolean = true;
  id_chofer: number = 0;
  constructor(private route: ActivatedRoute, private supa: SupabaseApiService,private router: Router,private toastController: ToastController) {
  }
   // Función para navegar a la página de inicio
  goToHome(){
    // Utiliza el Router para navegar a la ruta 'home' con el parámetro 'id'
    this.router.navigate(['/home',this.id]);
  }

  // esta funcion realizara todas los componetes cuando la pagina termina de cargar 
  async ngOnInit() {// async para declarar una función asincrónica

    // El método subscribe se utiliza para suscribirse a este observable y escuchar los cambios en los parámetros de la ruta
    this.route.params.subscribe(params => { 
      this.id = params['id']; //guardas el parametro en la variable 'id'
      console.log('hola usuario' + this.id); //se muestra en la consola
    });

    // Llama al método 'llamarUser' del servicio 'supa' y se guardan los datos en  la variable Usuario siendo llamado por su 'id'
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log(Usuario); //se muestra en la consola los datos que tiene 'Usuario'
    this.id_chofer = this.id // la id del usuario se guarda en la variabla id_chofer para darle un uso mas tarde
  }

  // Función para enviar datos
  subirDato() {
    if (this.asientos && this.destino && this.hora_ini && this.id_chofer) {
      // Si todos los datos requeridos están disponibles, crea un objeto con los datos
      const datos_recibidos = {
        // primero se pone el nombre de la tabla y luego el dato que quiero insertar
        asientos: this.asientos,
        destino: this.destino,
        hora_ini: this.hora_ini,
        estado_viaje: this.estado_viaje,
        id_chofer: this.id_chofer,
      };
      
      // Llama al método 'crearViajeCero' del servicio 'supa' y suscríbete al Observable
      this.supa.crearViajeCero(datos_recibidos).subscribe(
        (response) => {
          console.log('Datos subidos exitosamente', response); // Registra un mensaje de éxito y la respuesta
          
          // se llama la funcion con nombre 'mostrarMensaje'
          this.mostrarMensaje();
        },
        (error) => {
          console.error('Error al subir datos', error); // Registra un mensaje de error y el objeto de error
        }
      );
    }
  }
  
  // Función asincrónica para mostrar un mensaje tipo Toast
  async mostrarMensaje() {

    // Crear un Toast con el mensaje, duración y posición específicos
    const toast = await this.toastController.create({
      message: 'Datos subidos exitosamente', // Mensaje que se mostrará
      duration: 2000, // Duración en milisegundos durante la cual se mostrará el mensaje (2 segundos en este caso)
      position: 'middle' // Posición del mensaje en la pantalla (centro en este caso)
    });

    // Mostrar el Toast en la interfaz
    toast.present();
  }
}
