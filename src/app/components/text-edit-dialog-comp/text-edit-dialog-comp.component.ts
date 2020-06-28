import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'text-editor',
  templateUrl: './text-edit-dialog-comp.component.html',
  styleUrls: ['./text-edit-dialog-comp.component.scss']
})
export class TextEditDialogCompComponent implements OnInit {

  form: FormGroup = new FormGroup({ 
    'text': new FormControl( '', [ Validators.required ]),
    'size': new FormControl( 14, [ Validators.required ]),
    'font': new FormControl( '', [ Validators.required ]),
    'color': new FormControl( '#d44828', [ Validators.required ]),
  });
  sizesList = [ 6, 8, 12, 14, 18, 24, 36, 48, 72, 96 ];
  fontList = {  };
  colorList = { 
    'Red': '#d44828',
    'Orange': '#eb9f42',
    'Yellow': '#f0d92b',
    'Chartreuse': '#f0d92b',
    'Green': '#28b52d',
    'Cyan': '#58ede1',
    'Blue': '#1b78e3',
    'Violet': '#4127c4',
    'Purple': '#9d5edb',
    'Pink': '#e07aff',
    'Magenta': '#f2117e'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
