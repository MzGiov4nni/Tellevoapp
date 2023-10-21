import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { map } from 'rxjs';


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
    return this._http.get<any>('https://vgmnxcuuazgilywheivv.supabase.co/rest/v1/Usuario?select=*&correo=eq.'+Usuario.correo+'&contrasenna=eq.'+Usuario.contrasenna,{headers:this.supabaseHeaders}).pipe(
      map((data)=>{return data[0]})
    )
  }
}
