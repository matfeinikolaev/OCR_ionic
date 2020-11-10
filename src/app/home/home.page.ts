import { Component } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { OCR, OCRSourceType } from '@ionic-native/ocr/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    photos: any;
    result: any = [];
    foundText: any = false;
    loader: any = false;
    errorMessage: any = "";
  constructor(public imagePicker: ImagePicker, public ocr: OCR, private camera: Camera) {}
  picker () {
      this.errorMessage = "";
      let options = {
          maximumImagesCount: 1,
      }
      this.photos = new Array < string > ();
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.loader = true;
            this.ocr.recText(OCRSourceType.NORMFILEURL, results[i]).then((res) => {
                var result = res;
                this.foundText = result.foundText;
                if (this.foundText) {
                    this.result = result.words.wordtext;
                } else {
                    this.errorMessage = "No words found";
                }
                this.loader = false;
            }, err => {
                console.error(err);
            });
        }
      }, (err) => {
          console.error(err);
      });
  }

  takePicture() {
      this.errorMessage = "";
    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(base64Image);
        this.loader = true;
        this.ocr.recText(OCRSourceType.NORMFILEURL, imageData).then((res) => {
            var result = res;
            this.foundText = result.foundText;
            if (this.foundText) {
                this.result = result.words.wordtext;
            } else {
                this.errorMessage = "No words found";
            }
            this.loader = false;
        }, err => {
            console.error(err);
        });
    }, (err) => {
        console.error(err);
    });
  }

  return () {
      this.foundText = false;
      this.result = [];
  }
}
