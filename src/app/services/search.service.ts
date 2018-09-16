import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {of} from 'rxjs';
import {Profile} from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseURL = 'http://82.165.253.223:3000/maquilleuse';
  private defaultProfilePhoto = '../../assets/images/user_icon_placeholder.svg';

  constructor(private http: HttpClient) {
  }


  // exemple: http://82.165.253.223:3000/maquilleuse/|34000;montpellier|1|1,3/2|3|4/0/10
  requestSearch(elementsNumber: number = 10, displayedPage: number = 0,
                dept: string = null, city: string = null,
                businessType: string = null, expertiseType: string = null) {
    const typeURL = this.getTypePart(dept, city, businessType, expertiseType);
    const paramURL = this.getParamPart(dept, city, businessType, expertiseType);


    return this.http.get<any>(`${this.baseURL}/${paramURL}/${typeURL}/${displayedPage}/${elementsNumber}`)
      .pipe(
        map(profiles => {
          for (const profile of profiles) {
            if (!profile.photo_profile) {
              profile.photo_profile = this.defaultProfilePhoto;
            }
          }
          return profiles;
        }));
  }


  private getParamPart(dept: string, city: string, businessType: string, expertiseType: string) {
    let paramURL = '';

    if (dept !== null) {
      paramURL = dept.trim();
    }
    paramURL = `${paramURL}|`;

    if (city !== null) {
      paramURL += city.trim();
    }
    paramURL = `${paramURL}|`;

    if (businessType !== null) {
      paramURL += businessType.trim();
    }
    paramURL = `${paramURL}|`;

    if (expertiseType !== null) {
      paramURL += expertiseType.trim();
    }
    console.log('getParam: ' + paramURL);

    return paramURL;
  }


  private getTypePart(dept: string, city: string, businessType: string, expertiseType: string) {
    let typeURL = '';

    if (dept !== null) {
      typeURL = '1';
    }

    if (city !== null) {
      typeURL += '|2';
    }

    if (businessType !== null) {
      typeURL += '|3';
    }

    if (expertiseType !== null) {
      typeURL += '|4';
    }

    if (typeURL !== null && typeURL.startsWith('|')) {
      typeURL = typeURL.substring(1);
    }

    console.log('getType: ' + typeURL);

    return typeURL;
  }
}
