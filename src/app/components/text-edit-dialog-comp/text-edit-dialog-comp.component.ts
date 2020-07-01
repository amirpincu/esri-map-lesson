import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'text-editor',
  templateUrl: './text-edit-dialog-comp.component.html',
  styleUrls: ['./text-edit-dialog-comp.component.scss']
})
export class TextEditDialogCompComponent implements OnInit {
  @Output() sendSymbol: EventEmitter<object> = new EventEmitter<object>();
  stylize: boolean = true;

  form: FormGroup = new FormGroup({ 
    'text': new FormControl( 'Sample', [ Validators.required ]),
    'size': new FormControl( 72, [ Validators.required ]),
    'font': new FormControl( 'arial', [ Validators.required ]),
    'color': new FormControl( '#eee', [ Validators.required ]),
  });

  sizesList = [ 
    6, 8, 12, 14, 18, 24, 36, 48, 72, 96
  ];
  fontsDictinoray = {
    'Serif': {
      'arial': 'Arial',
      'josefin-slab': 'Josefin Slab',
      'ubuntu': 'Ubuntu',
    },
    'Sans-Serif': {
      'palatino-linotype': 'Palatino Linotype',
      'belleza': 'Belleza',
      'josefin-sans': 'Josefin Sans',
      'oswald': 'Oswald',
    },
    'Script': {
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

  ngOnInit(): void { this.emitSendSymbol(); }

  public emitSendSymbol(): void {
    const controls = this.form.controls;

    // Only show the bold and italic checkboxes for fonts that support them
    if (Object.keys(this.fontsDictinoray.Serif).includes(controls['font'].value)) {
      this.stylize = true;
    }
    else {
      this.stylize = false;
      this.isBold = false; this.isItalic = false;
    }

    // If everythings fine send the symbol
    if (this.form.valid) {
      const textSymbol: object = {
        type: 'text', // autocasts as new TextSymbol()
        color: controls['color'].value,
        text: controls['text'].value,
        font: {
          // autocasts as new Font()
          size: controls['size'].value,
          family: controls['font'].value,
          style: ( this.isItalic ? 'italic' : 'normal' ),
          weight: ( this.isBold ? 'bolder' : 'normal' )
        },

        yoffset: ( controls['size'].value * -0.5 ),
        haloSize: 1,
        haloColor: 'rgba(0, 0, 0, 0.5)'
      };
      this.sendSymbol.emit(textSymbol);
    }
  }
}
