import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Architecture } from 'src/app/model/model';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {
  readonly POST_URL = 'http://localhost:8080/api/parser/route';
  readonly GET_URL = 'http://localhost:8080/api/parser/integration';

  constructor(private http : HttpClient) { }

  postRoute(inputRoute : string) : Observable<any> {
    return this.http.post(this.POST_URL, {"route" : inputRoute});
  }

  getArchitecture() : Observable<Architecture> {
    return this.http.get<Architecture>(this.GET_URL);
  }

  createHeaders(headers : HttpHeaders) {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

}
