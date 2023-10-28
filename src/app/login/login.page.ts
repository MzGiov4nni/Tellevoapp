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
  id: number = 0;
  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, private router: Router, private x: SupabaseApiService) {

    this.formularioLogin = this.fb.group({
      'user_name': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    });
  }
  mostrar() {
    var x = document.getElementById('password') as HTMLInputElement; //as HTMLInputElement para realizar una conversión de tipoas HTMLInputElement para realizar una conversión de tipo
    //getElementById para buscar un elemento en el documento HTML con el atributo id igual a "password"
    if (x.type === "password") {
      x.type = "text";  //si la variable es de tipo Password la pasa a tipo Text 
    } else {
      x.type = "password"; // si la variable es no es de tipo Password la convertira de tipo Password
    }
  }
  goToRegistro() {
    this.router.navigate(['/registro'])
  }
  goToContrasenna() {
    this.router.navigate(['/recuperar'])
  }
  ngOnInit() {
    const supabaseUrl = 'https://vgmnxcuuazgilywheivv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8';
    const supabase = createClient(supabaseUrl, supabaseKey);

    async function fetchData() {
      const { data, error } = await supabase.from('Usuario').select('*');
      if (error) {
        console.error('Error al recuperar datos:', error);
      } else {
        console.log('Datos recuperados:', data);
      }

    }
    fetchData();
  }
  async ingresar() {
    var f = this.formularioLogin.value;
    console.log(f);

    try {
      const user = await lastValueFrom(this.x.loginuser(f));
      if (user) {
        console.log('Usuario ingresado');
        console.log(user)
        this.id = user.id;
        console.log(this.id);
        
        this.router.navigate(['/intro',{id:this.id}]);

      } else {
        console.log('Usuario no encontrado o error en la solicitud.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }
}
