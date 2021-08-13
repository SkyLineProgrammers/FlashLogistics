import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HelperService } from "app/helper.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-shiper-list',
  templateUrl: './shiper-list.component.html',
  styleUrls: ['./shiper-list.component.scss']
})
export class ShiperListComponent implements OnInit {

  ShiperList: any = [];

  constructor(
    private database: AngularFireDatabase,
    private Helper: HelperService,
    private router: Router,
  ) {

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
    // alert("Shiper");
    this.database.object('Shiper').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.ShiperList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ ShiperKey: SubArr[loop] }, data[SubArr[loop]]);
        this.ShiperList.push(object2);
      }
      this.ShiperList.reverse();

    })
  }

  Editmove(param) {

    sessionStorage.setItem('ShiperInformation', JSON.stringify(param));
  }
}
