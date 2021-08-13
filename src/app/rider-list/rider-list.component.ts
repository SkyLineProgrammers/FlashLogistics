import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HelperService } from "app/helper.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: ['./rider-list.component.scss']
})
export class RiderListComponent implements OnInit {

  riderList: any = [];

  constructor(private database: AngularFireDatabase, private Helper: HelperService, private router: Router) {

    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }

    this.FetchData();
  }

  ngOnInit() {
  }

  FetchData() {
    this.database.object('Rider').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.riderList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ RiderId: SubArr[loop] }, data[SubArr[loop]]);
        this.riderList.push(object2);
      }
      this.riderList.reverse();
    })
  }

  Editmove(param) {

    sessionStorage.setItem('RiderInformation', JSON.stringify(param));
    // this.Helper.RiderInformation = param;
  }
}
