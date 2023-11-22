import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  id_user: number = 0;

  constructor(
    private supa: SupabaseApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  // Función para navegar a la página de inicio
  goToHome() {
    // Utiliza el Router para navegar a la ruta 'home' con el parámetro 'id'
    this.router.navigate(['/home', this.id]);
  }

  goToDetalle_viaje(id: number) {
    this.idSeleccionado = id;
    this.id_user = this.id;
    this.router.navigate(['/detalle-viaje', this.idSeleccionado, this.id_user]);


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
}