import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-track-id',
  templateUrl: './track-id.component.html',
  styleUrls: ['./track-id.component.scss']
})
export class TrackIdComponent implements OnInit {

  OrderId = "";
  StatusReport = [];
  // private toastr: ToastrService
  constructor() { }

  ngOnInit() {
  }

  BtnSearch() {

    if (this.OrderId != "") {

      let data;
      let key;
      var ref = firebase.database().ref().child('Booking');
      ref.orderByChild('BookingID').startAt(this.OrderId).endAt(this.OrderId).on('child_added', function (result) {
        data = result.val();
        key = result.key;
      })
      setTimeout(() => {

        if (data == undefined) {
          this.StatusReport = [];
          alert("Invalid Order ID");
          // this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Invalid Order ID ', '', {
          //   timeOut: 8000,
          //   closeButton: true,
          //   enableHtml: true,
          //   toastClass: "alert alert-danger alert-with-icon",
          // });
        } else {
          console.clear();
          console.log(data);
          this.StatusReport = [];
          if (data.OrderBooked) {
            this.StatusReport.push("Your order has been Placed at this ( " + data.BookedDate.split(" ")[0] + " ) date and this ( " + data.BookedDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.ArrivedatStation) {
            this.StatusReport.push("Your order arrived at station at this ( " + data.ArrivedDate.split(" ")[0] + " ) date and this (" + data.ArrivedDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.ReadyToDispatch) {
            this.StatusReport.push("Your order has been ready to dispatched at this ( " + data.ReadyToDispatchDate.split(" ")[0] + " ) date and this ( " + data.ReadyToDispatchDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.Dispacthed) {
            this.StatusReport.push("Your order has been dispatched at this ( " + data.DispacthedDate.split(" ")[0] + " ) date and this ( " + data.DispacthedDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.Delivered) {
            this.StatusReport.push("Your order has been delivered sucessfully at this ( " + data.DeliveredDate.split(" ")[0] + " ) date and this ( " + data.DeliveredDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.CallNotResponse) {
            this.StatusReport.push("Your customer did not respond on call at this ( " + data.CallNotResponseDate.split(" ")[0] + " ) date and this ( " + data.CallNotResponseDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.Refused) {
            this.StatusReport.push("Your customer refused the parcel at this ( " + data.RefusedDate.split(" ")[0] + " ) date and this ( " + data.RefusedDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.ReAttempRequest) {
            this.StatusReport.push("Re attempt request at this ( " + data.ReAttempRequestDate.split(" ")[0] + " ) date and this ( " + data.ReAttempRequestDate.split(" ")[1].slice(0, -1) + " ) time");
          }
          if (data.ReturnToShiper) {
            this.StatusReport.push("Return to shiper at this ( " + data.ReturnToShiperDat.split(" ")[0] + " ) date and this ( " + data.ReturnToShiperDat.split(" ")[1].slice(0, -1) + " ) time");
          }

        }


      }, 500);

    } else {
      alert("Insert Order ID First");
      // this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Insert Order ID First', '', {
      //   timeOut: 8000,
      //   closeButton: true,
      //   enableHtml: true,
      //   toastClass: "alert alert-danger alert-with-icon",
      // });
    }



  }
}
