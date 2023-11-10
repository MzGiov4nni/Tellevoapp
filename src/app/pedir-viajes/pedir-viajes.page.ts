import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pedir-viajes',
  templateUrl: './pedir-viajes.page.html',
  styleUrls: ['./pedir-viajes.page.scss'],
})
export class PedirViajesPage implements OnInit {
  // Declarar propiedades de la clase con sus valores iniciales
  datosDeViajes: any[] = [];
  id: number = 0;
  nombreUsuario: string = '';
  idSeleccionado: number = 0;

  constructor(
    private supa: SupabaseApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  // Función para navegar a la página de inicio
  goToHome() {
    // Utiliza el Router para navegar a la ruta 'home' con el parámetro 'id'
    this.router.navigate(['/home', this.id]);
  }

  // esta funcion realizara todas los componetes cuando la pagina termina de cargar
  async ngOnInit() {
    // async para declarar una función asincrónica

    // Llama al método 'viajes' del servicio 'supa' y se llaman todos los datos de la tabla
    this.supa.viajes().subscribe((data) => {
      this.datosDeViajes = data; // se guardan los datos en la variable 'datosDeViajes'
      console.log(this.datosDeViajes); // se muestra en consola
    });

    // El método subscribe se utiliza para suscribirse a este observable y escuchar los cambios en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      this.id = params['id']; //guardas el parametro en la variable 'id'
      console.log('viajes ' + this.id); // se muestra en consola
    });
  }

  // Función para manejar la lógica al seleccionar un viaje
  async function() {
    // Llama al método 'llamarViajes' del servicio 'supa' y se llaman los dato segun su id que esta en la variable 'idSeleccionado'
    const datosviajes = await lastValueFrom(
      this.supa.llamarViajes(this.idSeleccionado)
    ); // se guardan los datos traidos en la varibla 'datosviajes'
    console.log(datosviajes); // se muestra en consola

    const asientos = datosviajes.asientos; // de la variable 'datosviajes'  solo sacamos los asientos y los guardamos en la variable 'asientos'
    console.log(asientos); // se muestra en consola

    const asientosbd = asientos - 1; // a la variable 'asientos' le elimonamos uno y lo guadamos en la variable 'asientosbd'
    console.log(asientosbd); // se muestra en consola

    // si la variable 'asientosbd' es igual a 0 entra al if
    if (asientosbd === 0) {
      console.log('if es 0'); // se muestra en consola
      // se llama la funcion llamada 'cambiarEstado'
      this.cambiarEstado();
    } else {
      console.log('else no es 0'); // se muestra en consola
    }

    // Llama al método 'modificarViaje' del servicio 'supa' y es cambian los datos por los datos que estan en la variable 'asientosbd' todo esto esta llamado por la variable 'idSeleccionado'
    this.supa.modificarViaje(this.idSeleccionado, asientosbd).subscribe(
      (response) => {
        console.log('Datos modificados exitosamente:', response);
      },
      (error) => {
        console.error('Error al modificar datos:', error);
      }
    );
  }

  // Función para cambiar el estado del viaje
  cambiarEstado() {
    // Llama al método 'cambiarEstado' del servicio 'supa' y se llaman los dato segun su id que esta en la variable 'idSeleccionado'
    this.supa.cambiarEstado(this.idSeleccionado).subscribe(
      (response) => {
        console.log('Datos modificados exitosamente:', response); // Registra un mensaje de éxito y la respuesta
        // se llama la funcion llamada 'recargarPagina'
        this.recargarPagina();
      },
      (error) => {
        console.error('Error al modificar datos:', error); // Registra un mensaje de error y el objeto de error
      }
    );
  }

  // Función para enviar el ID de un viaje seleccionado
  async enviarId(id: number) {
    // se guarda el id traida en la variable 'idSeleccionado'
    this.idSeleccionado = id;
    console.log('ID enviada al TypeScript:', this.idSeleccionado); // se muestra en consola

    // Llama al método 'llamarViajes' del servicio 'supa' y se llaman los dato segun su id que esta en la variable 'idSeleccionado'
    const datosviajes = await lastValueFrom(
      this.supa.llamarViajes(this.idSeleccionado)
    ); // se guardan los datos traidos en la varibla 'datosviajes'
    console.log(datosviajes); // se muestra en consola

    // se guarda el id traida en la variable 'id2'
    const id2 = datosviajes.id;
    const id_chofer = datosviajes.id_chofer;
    const id_user = this.id;
    console.log('id usuario ' + this.id);
    console.log('id chofer ' + id_chofer);
    // Llama al método 'eresPasajero' del servicio 'supa' y se le pasan las variables para que traiga datos o no los traiga
    const pasajero = await lastValueFrom(this.supa.eresPasajero(this.id, id2));
    console.log(pasajero); // se muestra en consola

    //si la variable 'pasajero' esta vacia entra al if
    if (id_chofer.toString() === id_user.toString()) {
      this.no_eres_pasajero();
    } else {
      if (!pasajero) {
        console.log('id usuario ' + this.id);
        console.log('id chofer ' + id_chofer);
        console.log('No eres pasajero');

        // Llama al método 'noeresPasajero'
        this.noeresPasajero();

        // Llama al método 'function'
        this.function();

        // Crea la variable para guardar datos llamada 'datosParaInsertar'
        const datosParaInsertar = {
          id_usuario: this.id,
          id_viajes: this.idSeleccionado,
        };

        // Llama al método 'crearViaje' del servicio 'supa' y se insertan los datos en 'datosParaInsertar'
        this.supa.crearViaje(datosParaInsertar).subscribe(
          (response) => {
            console.log('Datos insertados exitosamente:', response);
            // Puedes realizar acciones adicionales en caso de éxito
          },
          (error) => {
            console.error('Error al insertar datos:', error);
            // Maneja el error de manera más robusta, por ejemplo, muestra un mensaje al usuario
          }
        );
        this.recargarPagina();
      } else {
        console.log('Ya eres pasajero');
        // Llama al método 'eresPasajero'
        this.eresPasajero();
      }
    }
  }

  // Función para recargar la página actual
  recargarPagina() {
    window.location.reload();
  }

  // Función asincrónica para mostrar un mensaje tipo Toast
  async eresPasajero() {
    // Crear un Toast con el mensaje, duración y posición específicos
    const toast = await this.toastController.create({
      message: 'ya eres pasajero en este viaje', // Mensaje que se mostrará
      duration: 2000, // Duración en milisegundos durante la cual se mostrará el mensaje (2 segundos en este caso)
      position: 'middle', // Posición del mensaje en la pantalla (centro en este caso)
    });

    // Mostrar el Toast en la interfaz
    toast.present();
  }

  // Función asincrónica para mostrar un mensaje tipo Toast
  async noeresPasajero() {
    // Crear un Toast con el mensaje, duración y posición específicos
    const toast = await this.toastController.create({
      message: 'has apartado un asiento en ese viaje', // Mensaje que se mostrará
      duration: 2000, // Duración en milisegundos durante la cual se mostrará el mensaje (2 segundos en este caso)
      position: 'middle', // Posición del mensaje en la pantalla (centro en este caso)
    });

    // Mostrar el Toast en la interfaz
    toast.present();
  }

  async no_eres_pasajero() {
    // Crear un Toast con el mensaje, duración y posición específicos
    const toast = await this.toastController.create({
      message: 'eres el chofer de este viaje', // Mensaje que se mostrará
      duration: 2000, // Duración en milisegundos durante la cual se mostrará el mensaje (2 segundos en este caso)
      position: 'middle', // Posición del mensaje en la pantalla (centro en este caso)
    });

    // Mostrar el Toast en la interfaz
    toast.present();
  }
}
