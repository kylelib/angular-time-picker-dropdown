import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import moment = require('moment');

@Component({
  selector: 'lhi-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit, OnDestroy {
  // TODO: Need to return validation -- inherit from validator, but how Do
  //       we return validations from child controls?
  // TODO: Need to provide ngModel capability

  timeInput: string;
  timeFormat: string = 'hh:mm A';
  //standardPattern = '^([0-9]|[0-1][0-9]):(0|1|2|3|4|5)[0-9] (a|A|p|P)[mM]$';
  standardPattern = '^([0-9]|[0-1][0-9]):(0|1|2|3|4|5)[0-9] (am|AM|pm|PM)$';
  militaryPattern =
    '([0-9]|00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23):(0|1|2|3|4|5)[0-9]';
  timePattern: string;
  _interval: number = 30;
  @Input() get interval(): number {
    return this._interval;
  }
  set interval(value: number) {
    if (value && 60 % value == 0) {
      this._interval = value;
    } else {
      throw 'Interval must be divisible by 60';
    }
  }

  @Input() showDefaultErrors: boolean = true;

  // TODO: Condider allowing timeformat input -- how would we validate it?
  _showMilitaryTime: boolean = false;
  @Input() get showMilitaryTime(): boolean {
    return this._showMilitaryTime;
  }
  set showMilitaryTime(value: boolean) {
    this._showMilitaryTime = value;
    if (this._showMilitaryTime) {
      this.timeFormat = 'HH:mm';
      this.timePattern = this.militaryPattern;
    } else {
      this.timeFormat = 'hh:mm A';
      this.timePattern = this.standardPattern;
    }
  }

  _baseDate: Date;
  @Input() get baseDate(): Date {
    if (!this._baseDate) {
      this._baseDate = new Date();
    }
    return this._baseDate;
  }
  set baseDate(value: Date) {
    this._baseDate = value;
  }

  @Output() timeInputChange:EventEmitter<{ date: Date, time: string, timeFormat: string }> = 
    new EventEmitter<{ date: Date, time: string, timeFormat: string }>()

  //TODO: DateWithTime INPUT/Output
  //TODO: TimeString Output emeit

  ngOnInit(): void {
    this.timePattern = this.standardPattern;
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy()');
  }

  timeInputMaxLength(model) {
    if (model) {
      if (model.indexOf(':') == 1) {
        return this.showMilitaryTime ? 4 : 7;
      } else {
        return this.showMilitaryTime ? 5 : 8;
      }
    }
  }

  timeInputChanged(event) {
    console.log('timeInputChanged', event);
    const item = this.getTimes().find(t => t.time == event);
    if (item) {
      console.log(item.date);
      this.timeInputChange.emit({ date: item.date, time: item.time, timeFormat: this.timeFormat})
    } else {
      const m = moment(`${this.baseDate.toDateString()} ${event}`);
      console.log('IsValid', m.isValid());
      if (m.isValid()) {
        console.log(m.toDate());
        this.timeInputChange.emit({ date: m.toDate(), time: this.timeInput, timeFormat: this.timeFormat})
      }
    }
  }

  mouseDown(event) {
    console.log('Mouse down',event);
    return false;
  }

  timeInputKeyPress(event, model) {
    console.log('timeInputKeyPress', event, model, this.timePattern);
  }

  // Returns a list of times in the data by interval specified
  // default interval = 30 minutes -- interval must be divisible by 60
  // Array size = 60/interval * 24
  // e.g. 30 minutes = 48 entries
  getTimes = () => {
    const intervals = (60 / this.interval) * 24;
    const items = [];
    let currentDate = moment(this.baseDate.toDateString());
    new Array(intervals).fill('noop').map((acc, index) => {
      items.push({
        time: currentDate.format(this.timeFormat),
        date: currentDate.toDate()
      });
      currentDate = currentDate.add(this.interval, 'minutes');
    });
    return items;
  };
}
