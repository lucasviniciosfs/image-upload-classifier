import { Component, OnInit } from '@angular/core';

import * as mobilenet from '@tensorflow-models/mobilenet';
import { MobileNetVersion, MobileNetAlpha } from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops'
import { Observable } from 'rxjs';
import { iPredictions } from './interfaces/iPredictions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public srcResult: string;
  public model : mobilenet.MobileNet;
  public canvas : HTMLCanvasElement;
  public prediction : iPredictions[];
  public predictions : Array<iPredictions[]> = [];

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // Load the model.
    let version : MobileNetVersion = 2;
    let alpha : MobileNetVersion = 1;
    this.model = await mobilenet.load({version, alpha});

    // let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // // Classify the image.
    // let predictions = await this.model.classify(canvas);

    // console.log('Predictions: ');
    // console.log(predictions);
  }

  async onFileSelected() {
    let fileInput: any = document.getElementById('file');
    
    if (!(fileInput.files && fileInput.files[0])) { return }

    let filePath: string = fileInput.value;
    
    let positionDot = filePath.indexOf('.');
    let extensionFile = filePath.slice(positionDot);
    let reader = new FileReader();

    if (extensionFile.match(/.(jpg|jpeg|png)$/i)) {      
      // Image preview 
      reader.onload = function (e) {
        document.getElementById(
          'card').innerHTML =
          '<img width="auto" height="auto" id="canvas" src="' + e.target.result
          + '"/>';
      };
    } else if (extensionFile.match(/.(mp4|wmv|mov|avi)$/i)){  
      // Video preview 
      reader.onload = function (e) {
        document.getElementById(
          'card').innerHTML =
          '<video id="canvas" width="auto" height="auto" controls> '+
          '<source src="'+e.target.result+'"> '+ 
          '<video/>';
      };
    } else {
      document.getElementById(
        'card').innerHTML =
        '<p> File selected is not a image or video! </p>';      
    }
    
    reader.readAsDataURL(fileInput.files[0]);
  }

  async processImage(){  
    
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.tagName == 'VIDEO'){   
      let video = document.getElementById('canvas') as HTMLVideoElement;
      video.play();
      video.onplaying = async (event) => {      
        // Classify the video.
        this.prediction = await this.model.classify(canvas);
        this.predictions.push(this.prediction);
      };
    } else {   
      // Classify the image.
      this.prediction = await this.model.classify(canvas);
      this.predictions.push(this.prediction);   
    }
  }

}