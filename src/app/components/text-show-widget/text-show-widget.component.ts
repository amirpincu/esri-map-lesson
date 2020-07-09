import { Component, OnInit } from '@angular/core';
import { MapStoreServiceService } from 'src/app/services/map-store-service/map-store-service.service';

@Component({
  selector: 'text-show-widget',
  templateUrl: './text-show-widget.component.html',
  styleUrls: ['./text-show-widget.component.scss']
})
export class TextShowWidget implements OnInit {

  constructor( private mapStore: MapStoreServiceService ) { }

  ngOnInit(): void {
  }

}
