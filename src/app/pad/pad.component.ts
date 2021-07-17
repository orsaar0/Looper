import { EventEmitter, Component, OnInit, Input, Output } from '@angular/core';
import { Pad } from '../Pad';

@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.css']
})
export class PadComponent implements OnInit {

  @Input() pad: Pad;
  @Output() playAudio: EventEmitter<Pad> = new EventEmitter();
  @Output() stopAudio: EventEmitter<Pad> = new EventEmitter();

  play:boolean = false;
  audio:HTMLAudioElement = new Audio();

  constructor() {    
  }
  
  ngOnInit(): void {
    this.audio.loop = true;
    this.audio.src = `../../../assets/media/${this.pad.source}.mp3`;
    this.pad.audio = this.audio;
    this.pad.btn = "Play";
  }
  
  changeState(e:Event){
    e.stopPropagation();
    // e.preventDefault();
    this.play = !this.play;
    if(this.play){
      this.playAudio.emit(this.pad);
    }
    else{
      this.stopAudio.emit(this.pad);
    }
  }

}
