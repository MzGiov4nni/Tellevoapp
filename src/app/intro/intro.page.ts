import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: 'intro.page.html',
  styleUrls: ['intro.page.scss'],
})
export class IntroPage {
  constructor(private navCtrl: NavController, private ngZone: NgZone) {
    const tiempoMostrado = 3000; // Tiempo en milisegundos (3 segundos en este caso)
    
    setTimeout(() => {
      // Navega a la página siguiente después del tiempo especificado
      this.ngZone.run(() => {
        this.navCtrl.navigateForward('/home');
      });
    }, tiempoMostrado);
  }
}
