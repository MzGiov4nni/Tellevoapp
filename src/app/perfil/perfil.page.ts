import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Declarar propiedades de la clase con sus valores iniciales
  nombreUsuario!: string;
  id: number = 0;
  direccion: string='';
  celular:number=0;


  constructor(private route: ActivatedRoute, private supa: SupabaseApiService) { }

  // esta funcion realizara todas los componetes cuando la pagina termina de cargar 
  async ngOnInit() { // async para declarar una función asincrónica

    // El método subscribe se utiliza para suscribirse a este observable y escuchar los cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id']; //guardas el parametro en la variable 'id'
      console.log('hola grupo ' + this.id); // se muestra en consola
    });

    // Llama al método 'llamarUser' del servicio 'supa' y se guardan los datos en  la variable Usuario siendo llamado por su 'id'
    const Usuario = await lastValueFrom(this.supa.llamarUser(this.id));
    console.log(Usuario); // se muestra en consola

    // de la variable Usuario solo sacamos el User_name y la guardamos en la variable 'nombreUsuario' que usamos en el HTML para mostrar el nombre del usuario 
    this.nombreUsuario = Usuario.user_name;
    // de la variable Usuario solo sacamos el User_name y la guardamos en la variable 'celular' que usamos en el HTML para mostrar el nombre del usuario 
    this.celular= Usuario.celular;
    // de la variable Usuario solo sacamos el User_name y la guardamos en la variable 'direccion' que usamos en el HTML para mostrar el nombre del usuario 
    this.direccion= Usuario.direccion

  }


}
