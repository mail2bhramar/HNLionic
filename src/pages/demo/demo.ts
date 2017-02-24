import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-demo',
  templateUrl: 'demo.html'
})
export class DemoPage {

slides = [
    {
      title: "Welcome to Health Network Laboratories!",
      description: "The <b>Health Network Laboratories (HNL)</b> offers advanced laboratory diagnostic testing and convenient testing locations.",
      image: "assets/img/ica-slidebox-img-1.png",
    },
     {
      title: "Track you fitness",
      description: "Health is wealth, keep track of your fitness stats with us.",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "View Your Test Results",
      description: "You can get your test results, as soon as they're available",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    ,
    {
      title: "Schedule Home Call",
      description: "Book House call and get blood work done in the comfort of your own home.",
      image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Test center's Location",
      description: "Find Test center's near you and book an Appointment easily.",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];

  constructor(public navCtrl: NavController) {

  }

}
