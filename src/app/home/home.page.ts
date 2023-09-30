import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nombreUsuario!: string; // Propiedad para almacenar el nombre del usuario

  constructor() {}

  ngOnInit() {
    // Recuperar los datos del usuario desde el Local Storage
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombreUsuario = usuario.nombre;
    }
  }
  
}