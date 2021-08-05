import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Architecture, Channel } from 'src/app/model/model';

@Injectable({
  providedIn: 'root'
})
export class ParseService {
  readonly POST_URL = 'http://localhost:8080/api/parser/route';
  readonly ANALYZE_URL = 'http://localhost:8080/api/integration';
  readonly GET_URL = 'http://localhost:8080/api/parser/integration';
  readonly GET_FIXED_URL = 'http://localhost:8080/api/integration/fixed';

  constructor(private http: HttpClient) { }

  postRoute(inputRoute: string): Observable<any> {
    return this.http.post(this.POST_URL, { "route": inputRoute });
  }

  getArchitecture(): Observable<Architecture> {
    return this.http.get<Architecture>(this.GET_URL);
  }

  getFixedArchitecture(): Observable<Architecture> {
    return this.http.get<Architecture>(this.GET_FIXED_URL);
  }

  analyzeArchitecture(architecture: Architecture) {
    let body = JSON.stringify(architecture);
    console.log("Body: " + body);
    return this.http.post(this.ANALYZE_URL, body);
  }

  createHeaders(headers: HttpHeaders) {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

}
