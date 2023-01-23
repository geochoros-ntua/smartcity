import { TranslateService } from './../shared/translate/translate.service';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';


@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  @ViewChild('graphCanvas')
  graphCanvas: ElementRef | undefined;

  responses: any[] = [];
  variables: any[] = [];

  chartTypeValues: any[] = [
    { id: 0, value: 'bar', name_en: 'bar', name_gr: 'bar' },
    { id: 1, value: 'pie', name_en: 'pie', name_gr: 'pie' },
  ]


  filterVariables: any[] = [];
  filterVariableValues: any[] = [];


  selectedVariable: number = 62;
  selectedFilterVariable: string = '';
  selectedFilterValues: string[] = [];
  selectedChartType: number = 0;

  graphTitle: string = '';

  responsesChart: any;

  lang: string = 'gr';

  constructor(private httpClient: HttpClient, private translateService: TranslateService) {
    this.translateService.lang$.subscribe(value => {
      this.lang = value.toString();
    });
    this.lang = this.translateService.getLang();
  }

  ngOnInit(): void {
    Chart.register(...registerables);

    this.graphTitle = this.variables[this.selectedVariable]



    this.httpClient.get('assets/other/responses.csv', { responseType: 'text' }).subscribe(data => {
      const rows = data.split("\r");
      const headers = rows[0].split(';');

      for (let index = 2; index < headers.length; index++) {
        const element = headers[index];

        const obj = {
          id: index - 1,
          name: element
        }
        this.variables.push(obj);
        // console.log(element)
        if (element.startsWith('Ποιος είναι ο κύριος τρόπος μετακίνησής σας') || element.startsWith('Φύλο') || element.startsWith('Σε ποιο Δημοτικό Διαμέρισμα')) {
          this.filterVariables.push(element);
        }


      }

      for (let index = 1; index < rows.length - 1; index++) {
        const element = rows[index];
        const response: any = {};
        const properties = element.split(';')

        for (let j in headers) {
          response[headers[j]] = properties[j]
        }
        this.responses.push(response);
      }

      // console.log(this.responses)

      this.filterResponses()
    })



  }

  filterResponses() {

    const rawData: any[] = [];
    const values: any[] = [];
    let labels: any[] = [];

    let filteredData: any[] = [];
    if (this.selectedFilterValues.length !== 0) {
      this.responses.filter((item: any) => {
        if (this.selectedFilterValues.includes(item[this.selectedFilterVariable])) {
          filteredData.push(item)
        }
      })
    }
    else {
      filteredData = this.responses;
    }


    for (let index = 0; index < filteredData.length; index++) {
      const element = filteredData[index];
      // console.log(this.variables[this.selectedVariable -1].name)
      // console.log(element[this.variables[this.selectedVariable -1 ].name])

      rawData.push(element[this.variables[this.selectedVariable - 1].name])
    }

    labels = Array.from(new Set<string>(rawData));
    labels.sort();
    const frequency = rawData.reduce((prev, cur) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});

    // console.log(frequency);
    const sortedFrequency = Object.keys(frequency)
      .sort()
      .reduce((accumulator: any, key) => {
        accumulator[key] = frequency[key];

        return accumulator;
      }, {});

    const frequencyForPie = Object.values(sortedFrequency)

    if (this.selectedChartType === 1) {
      this.initChart(labels, frequencyForPie);

    }
    else {
      this.initChart(labels, sortedFrequency);
    }

  }

  initChart(labels: string[], values: any[]): void {
    if (this.responsesChart) {
      this.responsesChart.destroy();
    }

    this.responsesChart = new Chart(this.graphCanvas?.nativeElement, {
      type: this.selectedChartType === 1 ? 'pie' : 'bar',
      options: {
        responsive: true
      },
      data: {
        labels: labels,
        datasets: [
          {
            // barPercentage: 0.9,
            // categoryPercentage: 0.9,
            label: "# of persons",
            data: values,
            backgroundColor: ["rgba(244, 67, 54, 0.25)", "rgba(156, 39, 176, 0.25)", "rgba(33, 150, 243, 0.25)", "rgba(0, 150, 136, 0.25)", "rgba(255, 235, 59, 0.25)", "rgba(255, 152, 0, 0.25)"],
            borderColor: ["rgba(244, 67, 54, 1)", "rgba(156, 39, 176, 1)", "rgba(33, 150, 243, 1)", "rgba(0, 150, 136, 1)", "rgba(255, 235, 59, 1)", "rgba(255, 152, 0, 1)"],
            borderWidth: 2,
            borderRadius: 2,
            // spanGaps: falses 
          },
        ],
      },
    });



  }

  getFilterValues(filter: any) {
    this.filterVariableValues = [...new Set(this.responses.map(item => item[filter]))];

  }

  resetFilters() {
    this.selectedFilterValues = [];
    this.selectedFilterVariable = '';
    this.selectedChartType = 0;
    this.filterResponses();
  }

}
