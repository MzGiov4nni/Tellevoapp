import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { createClient } from '@supabase/supabase-js';
import { SupabaseApiService } from '../service/supabase/supabase-api.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Declarar propiedades de la clase con sus valores iniciales
  id: number = 0;
  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, private router: Router, private x: SupabaseApiService) {

    // Configurar el formulario de inicio de sesión utilizando FormBuilder
    this.formularioLogin = this.fb.group({
      'user_name': new FormControl("", Validators.required), // Campo de usuario con validación requerida
      'password': new FormControl("", Validators.required) // Campo de usuario con validación requerida
    });
  }

  // Función para navegar a la página de registro 
  goToRegistro() {
    // Utiliza el Router para navegar a la ruta 'login'
    this.router.navigate(['/registro'])
  }

   // Función para navegar a la página de para recuperar contraseña
  goToContrasenna() {
    // Utiliza el Router para navegar a la ruta 'login'    
    this.router.navigate(['/recuperar'])
  }

  // funcion para mostrar contraseña 
  mostrar() {
    var x = document.getElementById('password') as HTMLInputElement; //as HTMLInputElement para realizar una conversión de tipoas HTMLInputElement para realizar una conversión de tipo
    //getElementById para buscar un elemento en el documento HTML con el atributo id igual a "password"
    if (x.type === "password") {
      x.type = "text";  //si la variable es de tipo Password la pasa a tipo Text 
    } else {
      x.type = "password"; // si la variable es no es de tipo Password la convertira de tipo Password
    }
  }


  // esta funcion realizara todas los componetes cuando la pagina termina de cargar 
  ngOnInit() {
     // Configuración de Supabase para llamarlo con js o ts pero solo lo usamos aqui todas las otras formas son por otro
    const supabaseUrl = 'https://vgmnxcuuazgilywheivv.supabase.co'; // guardamos la URL en la variable 'supabaseUrl'
    // guardamos a apikey en la variable 'supabaseKey'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8';
    const supabase = createClient(supabaseUrl, supabaseKey); // creamos el clientes para que haga los trabajos de la vase de datos

    // Función asincrónica para obtener datos de usuarios desde Supabase
    async function fetchData() {
      // se hace un selec y te llaman todos los usuarios de la tabla 'Usuario'
      const { data, error } = await supabase.from('Usuario').select('*');
      //si tiene un error entrara al if 
      if (error) {
        // si da algun error se mostrara en consola el error
        console.error('Error al recuperar datos:', error);
      } else {
        // si no da algun error se mostrara en consola los datos recuperado
        console.log('Datos recuperados:', data);
      }

    }
    // se llama la funcion llanada 'fetchData'
    fetchData();
  }

  // Función para realizar el inicio de sesión
  async ingresar() {
    // se guardan los datos del formulario en la variable 'f' 
    var f = this.formularioLogin.value;
    console.log(f); // se muestra en consola

    try {

    // Llama al método 'loginuser' del servicio 'supa' y se guardan los datos en  la variable 'user' siendo llamado por la  variable'f'
      const user = await lastValueFrom(this.x.loginuser(f));
      
      // si hay un usuario se entra al if
      if (user) {

        console.log('Usuario ingresado'); // se muestra en consola
        console.log(user) // se muestra en consola
 
        this.id = user.id; // se guarda en la variable 'id' la id extraida la variable 'user'
        console.log(this.id); // se muestra en consola
        
        // Utiliza el Router para navegar a la ruta 'intro' con el parámetro 'id'
        this.router.navigate(['/intro',{id:this.id}]);

      } else {
        
        // si no se encuente usuari se muestra este mensaje en consola 
        console.log('Usuario no encontrado o error en la solicitud.');
      }
    } catch (error) {

      // si da algun error se mostrara en consola el error
      console.error('Error al obtener los datos del usuario:', error);
    }
  }
}
