import { Component, Input, VERSION } from '@angular/core';
import moment = require('moment');

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;
  selectedTime: any;

  startDate = moment('2021-07-27').toDate();
  _showMilitaryTime: boolean =false;
  @Input() get showMilitaryTime () {
    return this._showMilitaryTime;
  }
  set showMilitaryTime(value: boolean) {
    console.log("Setting military time", value);
    this._showMilitaryTime = value;
  }


  

  ngOnInit() {
  }

  timeSelected = (event) => {
    console.log("Time Selected:", event);
    this.selectedTime = event;
  }
}
