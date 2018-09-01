import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private zipCodeRegex = /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/;

  constructor(private http: HttpClient) { }

  getCitiesList(term: string = null) {
    if (term) {
      term = term.trim();

      /*if (this.zipCodeRegex.test(term)) {

      }*/

      // return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).pipe(map(rsp => rsp.items));
      // return this.http.get<any>(`https://geo.api.gouv.fr/communes?nom=${term}&fields=codesPostaux&format=json&geometry=centre`);
       return this.http.get<any>(`https://vicopo.selfbuild.fr/cherche/${term}`).pipe(map(obj => obj.cities));
    } else {
      return of([]);
    }
  }
}