import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioRegistro: FormGroup;
  
  constructor(public fb: FormBuilder,private router: Router,
    public alertController: AlertController) {
    this.formularioRegistro = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'confirmacionPassword': new FormControl("", Validators.required)
    });
  }

  ngOnInit() {
  }

  async guardar(){
    var f = this.formularioRegistro.value;

    if(this.formularioRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['Aceptar']
      });
  
      await alert.present();
      return;
    }

    var usuario = {
      nombre: f.nombre,
      password: f.password
    }

    localStorage.setItem('usuario',JSON.stringify(usuario));
    console.log('usuario',JSON.stringify(usuario))
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
  goToLogin(){
    this.router.navigate(['/login'])
  }
}