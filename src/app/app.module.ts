import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { createClient } from '@supabase/supabase-js';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

const supabaseUrl = 'https://vgmnxcuuazgilywheivv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8';
const supabase = createClient(supabaseUrl, supabaseKey);

@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
