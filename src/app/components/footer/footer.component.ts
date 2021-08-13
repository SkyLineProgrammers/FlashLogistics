import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test : Date = new Date();
  
  constructor(private database: AngularFireDatabase) { }

  ngOnInit() {
  }

  MYtest(){

    this.database.list("/SKUser/").push({
      Name: "Ibtesam Ahmed",
      pass: "123"
    });
    alert("Inserted");


  }

}
