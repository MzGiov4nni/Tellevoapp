import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nombreUsuario!: string; // Propiedad para almacenar el nombre del usuario

  constructor(private router: Router) {}
  
  goToPerfil(){
    this.router.navigate(['/perfil'])
  }

  ngOnInit() {
    // Recuperar los datos del usuario desde el Local Storage
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombreUsuario = usuario.nombre;
    }
  }
  
}