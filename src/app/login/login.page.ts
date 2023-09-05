import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  [x: string]: any;

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private router: Router) {
    this.loginForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Aquí puedes acceder a los datos del formulario
      const formData = this.loginForm.value;
      console.log(formData);

      // Realiza la lógica de inicio de sesión aquí
    }
  }
  goToRegistro(){
    this['router'].navigate(['/registro'])
  }
  goToHome(){
    this['router'].navigate(['/home'])
  }
}
