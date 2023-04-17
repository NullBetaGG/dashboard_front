import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  jsonData: any;
  dataArray = [];

  constructor(private getData: GetDataService) { }

  async ngOnInit() {
    this.dataArray = await this.getData.getArray();
  }


}
