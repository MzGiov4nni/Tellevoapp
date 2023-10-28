import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: 'intro.page.html',
  styleUrls: ['intro.page.scss'],
})
export class IntroPage {
  id: any;

  constructor(
    private navCtrl: NavController,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    const tiempoMostrado = 3000; // Tiempo en milisegundos (3 segundos en este caso)

    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    setTimeout(() => {
      this.ngZone.run(() => {
        this.navigateToHome();
      });
    }, tiempoMostrado);
  }

  // Función para navegar a la página "home" con el parámetro "id"
  navigateToHome() {
    this.navCtrl.navigateForward(['/home', this.id]);
  }
}