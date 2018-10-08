import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {DepartmentsService} from '../services/departments.service';
import {MatPaginator, PageEvent} from '@angular/material';
import {forkJoin, Observable} from 'rxjs';
import {SelectCitiesComponent} from '../utils/select-cities/select-cities.component';
import {SearchService} from '../services/search.service';
import {Profile} from '../models/profile.model';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Department} from '../models/department.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('citiesSelect') citiesSelect: SelectCitiesComponent;

  categoryTitle: string;
  departments: Array<any>;
  // selectedDeptObservable: Observable<Department>;
  selectedDept: Department;

  artistsProfiles: Profile[];

  pageLength = 1;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25];

  skinTypes = [
    {value: 1, label: 'Peau claire'},
    {value: 2, label: 'Peau foncée'},
    {value: 3, label: 'Peau mate'}
  ];
  selectedSkins = [];
  selectedCity = null;
  deptList: Observable<any[]>;
  businessType: number; // fonction de la page de recherche affichée

  artistFound = true;


  constructor(private router: Router, private deptService: DepartmentsService, private searchService: SearchService) {
  }

  ngOnInit() {

    this.deptList = this.deptService.getJSON();

    this.paginator._intl.itemsPerPageLabel = 'Prestataires par page';
    this.paginator._intl.firstPageLabel = 'Première page';
    this.paginator._intl.previousPageLabel = 'Page précédente';
    this.paginator._intl.nextPageLabel = 'Page suivante';
    this.paginator._intl.lastPageLabel = 'Dernière page';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 sur ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} sur ${length}`;
    };

    if (this.router.url.startsWith('/search-makeup')) {
      this.categoryTitle = 'maquillage';
      this.businessType = 1;
    } else if (this.router.url.startsWith('/search-microblading')) {
      this.categoryTitle = 'micro blading';
      this.businessType = 2;
    } else if (this.router.url.startsWith('/search-manicure')) {
      this.categoryTitle = 'manucure';
      this.businessType = 3;
    } else if (this.router.url.startsWith('/search-eyelashes')) {
      this.categoryTitle = 'extension de cils';
      this.businessType = 4;
    }

    this.deptService.getJSON().subscribe(data => {
      this.departments = data;
    });


    this.updateSearch();
  }

  onDeptChanged() {
    if (this.selectedCity) {
      if (!String(this.selectedCity.code).startsWith(this.selectedCity.code)) {
        this.citiesSelect.clearFields();
      }
    }
    this.updateSearch();
  }

  onCitySelected(city) {
    this.selectedCity = city;
    console.log('selected city = ' + JSON.stringify(this.selectedCity));
    this.updateSearch();
  }

  openProfileDetails(artistID: number) {
    this.router.navigate(['/profile-details', artistID]);
  }

  updateSearch() {
    // const skin = (!this.selectedSkins || this.selectedSkins.length === 0) ? null : String(this.selectedSkins[0].value);
    const biz = String(this.businessType);
    const city = !this.selectedCity ? null : String(this.selectedCity.code) + ';' + String(this.selectedCity.city);
    const dept = !this.selectedDept ? null : this.selectedDept.code;

    console.log(`skin = ${JSON.stringify(this.selectedSkins)}`);

    const searchObs = this.searchService.requestSearch(this.pageSize, this.pageIndex, dept, city, biz, this.selectedSkins);
    const countObs = this.searchService.requestSearchCount(dept, city, biz, this.selectedSkins);

    forkJoin([searchObs, countObs]).subscribe(results => {
      this.artistsProfiles = results[0];
      const count = results[1];

      this.artistFound = count > 0;

      const remainder = count % this.pageSize === 0 ? 0 : 1;
      this.pageLength = Math.floor(count / this.pageSize + remainder);
    }, error1 => {
      console.log('updateSearch erreur:\n ' + JSON.stringify(error1));
      this.artistFound = false;
    });
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageLength = pageEvent.length;
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;

    this.updateSearch();
    console.log('onPageEvent: ' + JSON.stringify(pageEvent));
  }

}
