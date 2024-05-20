import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PmsLoaderService } from 'src/app/Shared/Services/pms-loader.service';

@Component({
  selector: 'app-custom-canvas',
  templateUrl: './custom-canvas.component.html',
  styleUrls: ['./custom-canvas.component.scss']
})
export class CustomCanvasComponent implements OnChanges, OnInit {

  @Output() parrentAction = new EventEmitter<string>();

  @Input()
  canvasWidth!: any;

  @Input()
  canvasHeight!: any;

  @Input()
  UnitBlockSizeInPX!: any;

  @Input()
  breakchainMark!: any;

  @Input()
  graphUnitScope!: any;

  @Input()
  unitArray!: any;

  @Input()
  StripDetails!: any;

  constructor(
    private loaderservice : PmsLoaderService
  ) {}


  

  topPosition = 0
  leftPosition = 0
  stripHeight = 30
  @ViewChild('myCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  canvasIndStripPosList:any
  focussedOnStrip:any
  showTultip = false
  showEfectedRange = false
  efectedID:any
  ngOnChanges(changes: SimpleChanges): void {
    this.loaderservice.show()
    setTimeout(() => {
      this.renderCanvas()
    }, 100)
    setTimeout(() => {
      this.loaderservice.hide()
    }, 1500)
  }

  ngOnInit(): void {
  }

  renderCanvas() {
    if (this.UnitBlockSizeInPX < 15) {
      this.drawScale(this.canvasWidth, this.canvasHeight, this.breakchainMark * (this.UnitBlockSizeInPX / this.graphUnitScope), "#0d6efd", true)
    } else {
      this.drawScale(this.canvasWidth, this.canvasHeight, this.UnitBlockSizeInPX, "#0d6efd", false)
    }
    this.drawBoard(this.canvasWidth, this.canvasHeight, this.breakchainMark * (this.UnitBlockSizeInPX / this.graphUnitScope), "#0d6efd")
    this.drawBoard(this.canvasWidth, this.canvasHeight, this.UnitBlockSizeInPX, "#0d6efd4f")
    this.drawCanvas()
  }

  onCanvasMouseMove(event: MouseEvent,focusedOn:any): void {
    this.showTultip = false
    this.showEfectedRange = false
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.topPosition = y
    this.leftPosition = x
    this.checkCanvasActivity(focusedOn)
  }

  checkCanvasActivity(focusedOn:any) {
    for(let i=0;i<this.canvasIndStripPosList.length;i++) {
      if(this.topPosition >= this.canvasIndStripPosList[i].pos - (this.stripHeight/2) && this.topPosition <= this.canvasIndStripPosList[i].pos+this.stripHeight - (this.stripHeight/2)) {
        this.focussedOnStrip = this.canvasIndStripPosList[i]
        this.showTultip = true
        for(let j=0;j<this.focussedOnStrip.peacon_strip.length;j++) {
          if(focusedOn >= this.focussedOnStrip.peacon_strip[j].affected_start_meter && focusedOn <= this.focussedOnStrip.peacon_strip[j].affected_end_meter) {
            this.showEfectedRange = true
            this.efectedID = j
            break
          }
        }
      }
    }    
  }

  parsegetInt(data:any) {
    return parseInt(data)
  }

  clearCanvas() {
    let canvas: any = document.getElementById("myCanvas");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  drawScale(fullWidth: any, fullheight: any, unitWidth: any, color: any, macroView: boolean) {
    var bw = fullWidth;
    var bh = this.stripHeight * 3;
    var p = 0;
    var canvas: any = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.font = "10px Roboto";
    let index = 0
    for (var x = 0; x <= bw; x += unitWidth) {
      context.moveTo(0.5 + x + p, p);
      context.lineTo(0.5 + x + p, bh + p);
      var endingX = this.parsegetInt(x + 10);
      if (macroView) {
        this.drawRotatedText(endingX, 5, -Math.PI / 2, this.unitArray[index] + ' - ' + parseInt(this.unitArray[index] + this.breakchainMark) + ' M', context.font);
        index += this.breakchainMark / this.graphUnitScope 
      } else {
        this.drawRotatedText(endingX, 5, -Math.PI / 2, this.unitArray[index] + ' - ' + this.unitArray[index + 1] + ' M', context.font);
        index++
      }
    }
    for (var x = 0; x <= bh; x += this.stripHeight * 3) {
      context.moveTo(p, 0.5 + x + p);
      context.lineTo(bw + p, 0.5 + x + p);
    }
    context.stroke();
  }

  drawRotatedText(endingX: any, centerY: any, radianAngle: any, text: any, font: any) {
    var canvas: any = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.font = font;
    var width = ctx.measureText(text).width;
    ctx.translate(endingX, centerY);
    ctx.rotate(radianAngle);
    ctx.textBaseline = 'middle';
    ctx.fillText(text, -width, 0);
    ctx.restore();
  }


  drawBoard(fullWidth: any, fullheight: any, unitWidth: any, color: any) {
    var bw = fullWidth;
    var bh = fullheight;
    var p = 0;
    var canvas: any = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    for (var x = 0; x <= bw; x += unitWidth) {
      context.moveTo(0.5 + x + p, p + this.stripHeight * 3);
      context.lineTo(0.5 + x + p, bh + p + this.stripHeight * 3);
    }
    for (var x = 0; x <= bh; x += this.stripHeight) {
      context.moveTo(p, 0.5 + x + p + this.stripHeight * 3);
      context.lineTo(bw + p, 0.5 + x + p + this.stripHeight * 3);
    }
    context.strokeStyle = color;
    context.stroke();
  }

  drawCanvas() {
    var myCanvas: any = document.getElementById("myCanvas");
    var drawingContext = myCanvas.getContext("2d");
    var hightIndex = 3.5
    let stripHeightRange = []
    for (var i = 0; i < this.StripDetails.length; i++) {
      hightIndex++
      
      drawingContext.lineWidth = this.stripHeight;
      // drawingContext.strokeStyle = this.StripDetails[i].color_code;
      // drawingContext.strokeStyle = '#0d6efd';
      
      for (let j = 0; j < this.StripDetails[i].children.length; j++) {
        drawingContext.beginPath();
        drawingContext.strokeStyle = this.StripDetails[i].children[j].wbs_attribute[0].color_code;
        if(this.StripDetails[i].children[j].breakups.length > 0 && this.StripDetails[i].children[j].breakups[0].peacon_strip) {
          this.StripDetails[i].children[j].peacon_strip = this.StripDetails[i].children[j].breakups[0].peacon_strip
        } else {
          this.StripDetails[i].children[j].peacon_strip = []
        } 

        if(this.StripDetails[i].children[j].breakups.length > 0) {
          this.StripDetails[i].children[j].resolved_strip = this.StripDetails[i].children[j].breakups[0].resolved_strip
          this.StripDetails[i].children[j].files = this.StripDetails[i].children[j].breakups[0].files
          this.StripDetails[i].children[j].resolved_files = this.StripDetails[i].children[j].breakups[0].resolved_files
        }else {
          this.StripDetails[i].children[j].resolved_strip = []
          this.StripDetails[i].children[j].files = []
          this.StripDetails[i].children[j].resolved_files = []
        }

        let data = {
          issue_index : i,
          delay_breakups_Index : j,
          pos : hightIndex * this.stripHeight,
          count: this.StripDetails[i].children[j].peacon_strip.length,
          peacon_strip: this.StripDetails[i].children[j].peacon_strip,
          resolved_strip: this.StripDetails[i].children[j].resolved_strip,
          files: this.StripDetails[i].children[j].files,
        }
        stripHeightRange.push(data)
        for (let k = 0; k < this.StripDetails[i].children[j].peacon_strip.length; k++) {
          drawingContext.moveTo((((this.StripDetails[i].children[j].peacon_strip[k].affected_start_meter - this.unitArray[0]) * this.UnitBlockSizeInPX) / this.graphUnitScope), (hightIndex * this.stripHeight)); drawingContext.lineTo((((this.StripDetails[i].children[j].peacon_strip[k].affected_end_meter - this.unitArray[0]) * this.UnitBlockSizeInPX) / this.graphUnitScope), (hightIndex * this.stripHeight));
          drawingContext.stroke();
        }
        hightIndex++
      }
    }
    this.canvasIndStripPosList = stripHeightRange
  }
  checkAction(delay_breakup_data: any, clickArea: any, action: any) {

    let data = {
      delay_breakup_data:delay_breakup_data,
      clickArea: clickArea,
      action : action
    }
    this.parrentAction.emit(JSON.stringify(data))
  }
}