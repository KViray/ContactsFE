import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _apiUrl: string = 'https://localhost:7099';

  constructor(private _http: HttpClient) { }

  generateToken()
  {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this._http.post<any>(this._apiUrl + "/JwtToken",httpOptions)
  }
}
