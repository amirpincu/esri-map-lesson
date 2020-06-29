import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'text-editor',
  templateUrl: './text-edit-dialog-comp.component.html',
  styleUrls: ['./text-edit-dialog-comp.component.scss']
})
export class TextEditDialogCompComponent implements OnInit {
  @Output() sendSymbol: EventEmitter<object> = new EventEmitter<object>();

  form: FormGroup = new FormGroup({ 
    'text': new FormControl( '', [ Validators.required ]),
    'size': new FormControl( 14, [ Validators.required ]),
    'font': new FormControl( 'arial', [ Validators.required ]),
    'color': new FormControl( '#222', [ Validators.required ]),
  });

  sizesList = [ 
    6, 8, 12, 14, 18, 24, 36, 48, 72, 96
  ];
  fontsDictinoray = {
    'Default': {
      'arial': 'Arial',
      'arial-unicode': 'Arial Unicode'
    },
    'Sans-Serif': {
      'belleza': 'Belleza',
      'josefin-sans': 'Josefin Sans',
      'oswald': 'Oswald',
      'ubuntu': 'Ubuntu',
      'timmana': 'Timmana'
    },
    'Serif': {
      'inkut-antiqua': 'Inkut Antiqua',
      'josefin-slab': 'Josefin Slab',
      'palatino-linotype': 'Palatino Linotype',
    },
    'Script': {
      'amatic': 'Amatic',
      'coming-soon': 'Coming Soon',
      'homemade-apple': 'Homemade Apple',
      'just-another-hand': 'Just Another Hand',
      'oregano': 'Oregano',
      'walter-turncoat': 'Walter Turncoat'
    },
    'Ornamental': {
      'amarante': 'Amarante',
      'audiowide': 'Audiowide',
      'kranky': 'Kranky',
      'pacifico': 'Pacifico',
      'rye': 'Rye',
      'syncopate': 'Syncopate',
      'unifrafturcoof': 'Unifraftutcoof',
      'vast-shadow': 'Vast Shadow'
    }
  };
  colorList = { 
    'Red': '#d44828',
    'Orange': '#eb9f42',
    'Yellow': '#f0d92b',
    'Chartreuse': '#e0f92b',
    'Green': '#28b52d',
    'Cyan': '#58ede1',
    'Blue': '#1b78e3',
    'Violet': '#4127c4',
    'Purple': '#9d5edb',
    'Pink': '#e07aff',
    'Magenta': '#f2117e',
    'White': '#eee',
    'Black': '#222'
  };
  isBold: boolean; isItalic: boolean;

  constructor() { }

  ngOnInit(): void { }

  public emitSendSymbol(): void {
    console.log("b");
    const controls = this.form.controls;
    if (this.form.valid) {
      const textSymbol: object = {
        type: 'text', // autocasts as new TextSymbol()
        color: controls['color'].value,
        text: controls['text'].value,
        style: ( this.isItalic ? 'italic' : 'normal' ),
        weight: ( this.isBold ? 'bolder' : 'normal' ),
        font: {
          // autocasts as new Font()
          size: controls['size'].value,
          family: controls['font'].value
        },

        haloSize: 1,
        haloColor: 'rgba(0, 0, 0, 0.5)'
      };
      this.sendSymbol.emit(textSymbol);
    }
  }
}
