import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { endpoint } from "./api-config";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private join(...parts: string[]): string {
    let output = '';
    parts.forEach(part => {
      if (part.startsWith('/') || output.endsWith('/')) {
        output = `${output}${part}`;
      } else {
        output = `${output}/${part}`;
      }
    })
    return output.substring(1); // substring(1) so that the output doesn't starts with a /
  }

  private prepareEndpoint(paths: string|string[]): string {
    let _paths: string[] = Array.isArray(paths) ? paths : [paths];
    if(_paths[0] !== endpoint) {
      _paths.unshift(endpoint);
    }
    let _endpoint = this.join(..._paths);
    return _endpoint;
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.prepareEndpoint(path));
  }
}
