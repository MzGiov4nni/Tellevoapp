import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SupabaseApiService {

  constructor(private _http:HttpClient) { }

  supabaseHeaders= new HttpHeaders()
  .set('apikey','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbW54Y3V1YXpnaWx5d2hlaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2Mzk2MjAsImV4cCI6MjAxMzIxNTYyMH0.O-wxs7VxhOZ8-SWBE0f-KfxYYOss3QI-wnY0nW8MtU8')

  getUser(){
    return this._http.get('https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Usuario?select=*',{headers:this.supabaseHeaders})
  }
  loginuser(Usuario:any){
    return this._http.get<any>('https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Usuario?select=*&user_name=eq.'+Usuario.user_name+'&password=eq.'+Usuario.password,{headers:this.supabaseHeaders}).pipe(
      map((data) => {       
          return data[0];
      })
    );
  }
  llamarUser(id_user:any){
    return this._http.get<any>('https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Usuario?select=*&id=eq.'+id_user,{headers:this.supabaseHeaders}).pipe(
      map((data) => {       
          return data[0];
      })
    );
  }
  viajes(){
    return this._http.get<any>('https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Viaje?select=*',{headers:this.supabaseHeaders});
  }
  crearViaje(datosParaInsertar: any){
    return this._http.post<any>('https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Viajes_alumnos', datosParaInsertar, {headers:this.supabaseHeaders});
  }
  llamarViajes(id_viaje:any){
    return this._http.get<any>('https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Viaje?select=*&id=eq.'+id_viaje,{headers:this.supabaseHeaders}).pipe(
      map((data) => {
        return data[0];
      })
    )
  }
  modificarViaje(id_viaje: any, datosModificar: any) {
    const url = `https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Viaje?id=eq.${id_viaje}`;
    const data = { asientos: datosModificar };
    return this._http.patch<any>(url, data, { headers: this.supabaseHeaders });
  }

  cambiarEstado(id_viaje: any){
    const url = `https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Viaje?id=eq.${id_viaje}`;
    const data = { estado_viaje: false  };
    return this._http.patch<any>(url, data, { headers: this.supabaseHeaders });
  }

  crearViajeCero(datosRecibidos: any): Observable<any> {
    const url = 'https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Viaje';
    return this._http.post(url, datosRecibidos, { headers: this.supabaseHeaders });
  }
}