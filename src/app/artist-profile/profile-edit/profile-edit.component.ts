import {Component, OnInit, ViewChild} from '@angular/core';
import {Profile} from '../../models/profile.model';
import {ProfileService} from '../../services/profile.service';

import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  @ViewChild('postalCodeInput') zipCodeInput;
  @ViewChild('sloganArea') sloganArea;


  sloganMaxLen = 500;

  currentProfile: Profile;
  currentProfileCopy: Profile;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.currentProfile.subscribe(res => this.currentProfile = res);
    this.currentProfileCopy = cloneDeep(this.currentProfile);
  }

  zipCodeChecker(event: KeyboardEvent) {
    if (this.zipCodeInput.nativeElement.value.length >= 5) {
      event.preventDefault();
    } else {
      const pattern = /[0-9\+\-\ ]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode !== 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

  phoneChecker(event: KeyboardEvent) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  saveEditProfile() {
    this.currentProfile = cloneDeep(this.currentProfileCopy);
    this.profileService.updateProfile(this.currentProfile);
  }

}
