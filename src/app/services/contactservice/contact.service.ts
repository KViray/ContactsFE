import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
private _apiUrl: string = 'https://localhost:7099';
  constructor(private _http: HttpClient) {
   }
   getContacts(){
      let head_obj = new HttpHeaders().set("Authorization", "bearer "+ localStorage.getItem("userAuth"),)
      return this._http.get<any>(this._apiUrl + '/Contacts',{headers: head_obj}).pipe(catchError(this.errorHandler));
   }
   addContacts(params: any){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                  'Authorization':'bearer '+ localStorage.getItem("userAuth") })
    };
    
    return this._http.post<any>(this._apiUrl + "/Contacts",params, httpOptions)
    .pipe(catchError(this.errorHandler));
   }
   updateContacts(id: number, contacts: any)
   {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                  'Authorization':'bearer '+ localStorage.getItem("userAuth") })
    };
    return this._http.patch<any>(this._apiUrl + `/Contacts?id=${id}`, contacts, httpOptions)
    .pipe(catchError(this.errorHandler));
   }
   deleteContact(id : number){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                  'Authorization':'bearer '+ localStorage.getItem("userAuth") })
    };
    return this._http.delete(this._apiUrl + `/Contacts?id=${id}`,httpOptions).pipe(catchError(this.errorHandler));
   }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error!');
  }
}
