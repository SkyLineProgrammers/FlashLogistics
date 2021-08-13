import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HelperService } from "app/helper.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList: any = [];

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
    this.database.object('Empolyee').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.userList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ UserId: SubArr[loop] }, data[SubArr[loop]]);
        if (object2.Name != "KaafMedia") {
          this.userList.push(object2);
        }
      }
      this.userList.reverse();
    })
  }

  Editmove(param) {
    sessionStorage.setItem('EmployeeInformation', JSON.stringify(param));
    // this.Helper.UserInformation = param;
  }
}
