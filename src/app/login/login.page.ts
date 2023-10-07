import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController,private router: Router) { 
  
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("", Validators.required),
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
  goToRegistro(){
    this.router.navigate(['/registro'])
  }
  goToContrasenna(){
    this.router.navigate(['/recuperar'])
  }
  ngOnInit() {
  }
  async ingresar(){
    var f = this.formularioLogin.value;
    var usuarioString = localStorage.getItem('usuario');
    
    if (usuarioString !== null) {
      var usuario = JSON.parse(usuarioString);

      if (usuario.nombre === f.nombre && usuario.password === f.password) {
        console.log('Ingresado');
        this.router.navigate(['/intro'])
      } else {
        const alert = await this.alertController.create({
          header: 'Datos incorrectos',
          message: 'Los datos que ingresaste son incorrectos.',
          buttons: ['Aceptar']
        });
  
        await alert.present();
      }
    } else {
      // Manejar el caso en el que 'usuarioString' es nulo (localStorage vacío)
      const alert = await this.alertController.create({
        header: 'Sin usuario',
        message: 'No se encontró ningún usuario en el almacenamiento local.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }

}