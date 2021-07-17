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
  start: number = 0;
  sounds_counter: number = 0;
  all_stopped: boolean = false;

  constructor(private padService: PadService) { 
  }
  
  ngOnInit(): void {
    // using the observable as a promise
    // mocking DB
    this.padService.getPads().subscribe((pads) => this.pads = pads);
  }

  play(pad:Pad){
    this.all_stopped = false;
    if(this.sounds_counter == 0){ // first audio starts playing
      this.sounds_counter++;
      this.playNow(pad);
      this.start = Date.now();
    }
    else{
      pad.btn = "Waiting...";
      let waitingTime:number = 8000 - (Date.now()-this.start) % 8000; // setting the right time to play
      setTimeout(() => {
        if(!this.all_stopped){
          this.playNow(pad)
          this.sounds_counter++;
        }
        else{
          pad.btn = "Play";
        }
      }, waitingTime);
    }  
  }

  playNow(pad:Pad){
    pad.btn = "Pause";
    pad.audio!.load(); 
    pad.audio!.play();
  }

  stop(pad:Pad){
    pad.btn = "Play";
    if(!pad.audio!.paused){
      this.sounds_counter--;
    }
    pad.audio!.pause();
  }
  
  stopAll(e:Event){
    e.preventDefault();
    e.stopPropagation();
    this.all_stopped = true;
    for (let pad of this.pads){
      this.stop(pad);
    }
    this.sounds_counter = 0;
  }

  record(e:Event){

  }

}
