import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Architecture, Channel } from 'src/app/model/model';

@Injectable({
  providedIn: 'root'
})
export class ParseService {
  readonly POST_URL = 'api/parser/route';
  readonly SET_ARCHITECTURE_URL = 'api/integration';
  readonly GET_URL = 'api/parser/integration';
  readonly GET_FIXED_URL = 'api/integration/fixed';
  readonly GET_ANALYZED_URL = 'api/integration/analyzed';

  constructor(private http: HttpClient) { }

  getUrl(endpoint: string) : string {
    let host: string = "http://" + location.host.split(":")[0]
    return host + ":8080/" + endpoint
  }
  postRoute(inputRoute: string): Observable<any> {
    return this.http.post(this.getUrl(this.POST_URL), { "route": inputRoute });
  }

  getArchitecture(): Observable<Architecture> {
    return this.http.get<Architecture>(this.getUrl(this.GET_URL));
  }

  getFixedArchitecture(): Observable<Architecture> {
    return this.http.get<Architecture>(this.getUrl(this.GET_FIXED_URL));
  }

  getAnalyzedArchitecture(): Observable<Architecture> {
    return this.http.get<Architecture>(this.getUrl(this.GET_ANALYZED_URL));
  }

  setArchitecture(architecture: Architecture) {
    let body = JSON.stringify(architecture);
    console.log("Body: " + body);
    return this.http.post(
      this.getUrl(this.SET_ARCHITECTURE_URL), 
      body, 
      {'headers': {
        'content-type': 'application/json'
      }});
  }

}
