import { TopbarService } from './topbar.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit{
  // is_logged = this.get_is_logged();

  constructor(
    private route: ActivatedRoute,
    private topbarService: TopbarService,
  ) { 
    // this.is_logged = topbarService.get_is_logged();
  }

  

  ngOnInit() {
    // this.is_logged = this.topbarService.is_logged;
  }

  get_is_logged(){
    return this.topbarService.is_logged;
  }

  
}