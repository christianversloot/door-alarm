import { Component, OnInit } from '@angular/core';
import { AccordService } from './accord.service';

@Component({
  selector: 'app-accord',
  templateUrl: './accord.component.html',
  styleUrls: ['./accord.component.css']
})
export class AccordComponent {

  /**
   * Constructor
   * @param accordService - injected service
   */
  constructor(
    public accordService: AccordService,
  ) { }

}
