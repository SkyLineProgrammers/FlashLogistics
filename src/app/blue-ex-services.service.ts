import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class BlueExServicesService {


  configUrl = "http://bigazure.com/api/json_v2/";
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  constructor(
    private http: HttpClient
  ) { }

  saveBlueExOrder(param): Observable<Response | any> {

    let test3 = `{"acno": "KHI-06123", "testbit": "y", "userid": "feuztek", "password": "Feuz1122", "service_code": "BG", "cn_generate": "y", "customer_name": "FAHAD", "customer_email": "fahadbashir757@gmail.com", "customer_contact": "03062928049", "customer_address": "PIÀ EMPLOYEES COOPERATIVE SOCIETY GATE 2 STREET B2 HOUSE NUMBER B-174 GROUND FLOOR GULISTAN E JOHAR Plot # 5 blueEx Awami Markaz Shahrah-E-Faisal Karachi", "customer_city": "KHI", "customer_country": "PK",
      "customer_comment": "demo", "shipping_charges": "150", "payment_type": "COD", "shipper_origion_city": "KHI", "total_order_amount": "4150.00",
      "order_refernce_code": "bluedemo1", "products_detail": [{ "product_code": "1005", "product_name": "Polo T shirt", "product_price": "1000", "product_weight": "0.5", "product_quantity": "2", "product_variations": "small-black", "sku_code": "12assk11aa" }]}`;


    let aa = `order=${test3}`;
    return this.http.post(this.configUrl + "placeorder/placeorder.php", param, this.options)
  }


  getCities(): Observable<Response | any> {

    var options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    var link = `https://bigazure.com/api/json_v2/cities/get_cities.php`;
    return this.http.get(link, options)
  }

  blueExstatusTime(param): Observable<Response | any> {

    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('KHI-06123:7KPfAKnitQZKM217Izx')
      })
    };

    let obj = {
      'consignment_no': param
    };

    // let aa = `grant_type=password,UserName=20151-19314,Password=Learner@690,AppSource=2`;
    return this.http.post("https://bigazure.com/api/json_v3/tracking/get_tracking.php",
      obj
      , options)
  }

  blueExstatus(param): Observable<Response | any> {

    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('KHI-06123:7KPfAKnitQZKM217Izx')
      })
    };

    let obj = {
      'consignment_no': param
    };

    // let aa = `grant_type=password,UserName=20151-19314,Password=Learner@690,AppSource=2`;
    return this.http.post("https://bigazure.com/api/json_v3/status/get_status.php",
      obj
      , options)
  }

  getStatus(param): Observable<Response | any> {

    var options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    var link = `https://bigazure.com/api/json_v2/tracking/tracking.php?tracking={ "acno" : "KHI-06123", "userid": "feuztek", "password": "54321", "consignment_no": "${param}" }`;
    return this.http.get(link, options)
  }


}