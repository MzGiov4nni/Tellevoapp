import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: 'intro.page.html',
  styleUrls: ['intro.page.scss'],
})
export class IntroPage {
  // Declarar propiedades de la clase con sus valores iniciales
  id: any;

  constructor(
    private navCtrl: NavController,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    //se daclara el tiempo y se guarda en la variable 'tiempoMostrado'
    const tiempoMostrado = 3000; // Tiempo en milisegundos (3 segundos en este caso)

    // El método subscribe se utiliza para suscribirse a este observable y escuchar los cambios en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      this.id = params['id']; //guardas el parametro en la variable 'id'
    });

    // Después de un tiempo determinado, ejecutar la función para navegar a la página "home"
    setTimeout(() => {
      this.ngZone.run(() => {
        //se llama la funcion llamada 'navigateToHome'
        this.navigateToHome();
      });
    }, tiempoMostrado);
  }

  // Función para navegar a la página de inicio
  navigateToHome() {
    // Función para navegar a la página "home" con el parámetro "id"
    this.navCtrl.navigateForward(['/home', this.id]);
  }
}
