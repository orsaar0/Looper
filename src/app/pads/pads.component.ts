import { Component, OnInit } from '@angular/core';
import { Pad } from '../Pad'
import { PadService } from '../services/pad.service';

@Component({
  selector: 'app-pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.css']
})

export class PadsComponent implements OnInit {

  pads: Pad[] = [];
  record_logs: { time: number, pad: Pad, method: Function }[] = [];
  start: number = 0;
  sounds_counter: number = 0;
  all_stopped: boolean = false;
  record_enabled: boolean = false;
  playing_record: boolean = false;

  constructor(private padService: PadService) {
  }

  ngOnInit(): void {
    // using the observable as a promise
    // mocking DB
    this.padService.getPads().subscribe((pads) => this.pads = pads);
  }

  play(pad: Pad) {
    this.all_stopped = false;
    let waitingTime: number = 0;
    if (this.sounds_counter == 0) { // first audio starts playing
      this.start = Date.now();
      this.sounds_counter++;
      pad.btn = { label: "Pause", disabled: false };
      this.playNow(pad);
    }
    else {
      pad.btn = { label: "Wait for it...", disabled: true };
      waitingTime = 8000 - (Date.now() - this.start) % 8000; // setting the right time to play
      setTimeout(() => {
        if (!this.all_stopped) {
          pad.btn = { label: "Pause", disabled: false };
          this.playNow(pad)
          this.sounds_counter++;
        }
        else {
          pad.btn = { label: "Play", disabled: false };
        }
      }, waitingTime);
    }
    if (this.record_enabled) {
      let whenToPlay = Date.now() - this.start + waitingTime;
      this.record_logs.push({ time: whenToPlay, pad: pad, method: this.playNow });
    }
  }

  
  stop(pad: Pad) {
    if (pad.audio && !pad.audio!.paused) {
      this.sounds_counter--;
    }
    pad.btn = { label: "Play", disabled: false };
    this.stopNow(pad);
    if (this.record_enabled) {
      let whenToStop = Date.now() - this.start;
      this.record_logs.push({ time: whenToStop, pad: pad, method: this.stopNow });
    }
  }
  
  stopAll() {
    this.all_stopped = true;
    for (let pad of this.pads) {
      this.stop(pad);
    }
    this.sounds_counter = 0;
  }
  
  playNow(pad: Pad) {
    if (pad.audio) {
      pad.audio!.load();
      pad.audio!.play();
    }
  }

  stopNow(pad: Pad) {
    if (pad.audio) {
      pad.audio!.pause();
    }
  }

  handleRecordBtn() {
    if (this.record_enabled) {
      this.stopAll(); // stop all and document in log
    }
    else{
      this.record_logs = []; // starting new log
    }
    this.record_enabled = !this.record_enabled // change record state
  }

  playLastSession() {
    this.record_enabled = false;
    this.playing_record = !this.playing_record; // check if play/pause click
    if (this.playing_record) { // play session
      let finish_time = Date.now() - this.start;
      this.pads.forEach((pad: Pad) => { pad.btn = { label: "Play", disabled: true } }); // disable play btns
      this.record_logs.forEach((log: { time: number, pad: Pad, method: Function }) => {
        setTimeout(() => {
          log.method(log.pad)
        },
          log.time)
      })
      setTimeout(() => { // when finish playing record, 
        this.stopAll(); // enable play btns
        this.playing_record = !this.playing_record;
      },
        finish_time)
    }
    else { // pause session
      this.stopAll();
    }
  }

}
