import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { GraphReport } from '../../api/map.api';

@Component({
  selector: 'app-sensors-tab-layout',
  templateUrl: './sensors-tab-layout.component.html',
  styleUrls: ['./sensors-tab-layout.component.scss']
})
export class SensorsTabLayoutComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {data:GraphReport[], imageid: string}, public darkThemeService: DarkThemeService) {
    
  }

  ngOnInit(): void {

  }



  
  
}
