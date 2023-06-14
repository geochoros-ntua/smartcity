import { TranslateService } from './../shared/translate/translate.service';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables, TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  @ViewChild('graphCanvas')
  graphCanvas: ElementRef | undefined;

  @ViewChild('selectValues') selectValues: MatSelect;

  responses_residents: any[] = [];
  responses_students: any[] = [];
  variables_residents: any[] = [];
  variables_students: any[] = [];

  respondents: any[] = [
    { id: 1, name_en: 'residents', name_gr: 'κάτοικοι' },
    { id: 2, name_en: 'students', name_gr: 'μαθητές' },
  ]

  chartTypeValues: any[] = [
    { id: 0, value: 'bar', name_en: 'bar', name_gr: 'μπάρα' },
    { id: 1, value: 'pie', name_en: 'pie', name_gr: 'πίτα' },
    { id: 2, value: 'radar', name_en: 'radar', name_gr: 'ραντάρ' },
  ]


  filterVariables_residents: any[] = [];
  filterVariables_students: any[] = [];

  filterVariableValues: any[] = [];

  selectedRespondents: number = 1;
  selectedVariable: number = 61;
  selectedFilterVariable: string = '';
  selectedFilterValues: string[] = [];
  allSelected: boolean = false;

  showStudentsWishes: boolean = false;
  studentsWishes: any[] = [];

  selectedChartType: number = 0;

  graphTitle: any = null;

  responsesChart: any;

  stackedBar: boolean = false;

  lang: string = 'gr';

  constructor(private httpClient: HttpClient, private translateService: TranslateService) {
    this.translateService.lang$.subscribe(value => {
      this.lang = value.toString();
    });
    this.lang = this.translateService.getLang();
  }

  ngOnInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    // this.graphTitle = this.variables[this.selectedVariable]



    this.httpClient.get('assets/other/responses_students.csv', { responseType: 'text' }).subscribe(data => {
      const rows = data.split("\n");
      const headers = rows[0].split(';');
      for (let index = 1; index < headers.length; index++) {
        const element = headers[index];
        const obj = {
          id: index - 1,
          name: element
        }
        this.variables_students.push(obj);
        if (element.startsWith('Ποιος είναι ο κύριος τρόπος μετακίνησής σας') || element.startsWith('Φύλο') || element.startsWith('Σε ποιο Δημοτικό Διαμέρισμα')) {
          this.filterVariables_students.push(element);
        }
      }
      for (let index = 1; index < rows.length - 1; index++) {
        const element = rows[index];
        const response: any = {};
        const properties = element.split(';')
        for (let j in headers) {
          response[headers[j]] = properties[j]
        }
        this.responses_students.push(response);
      }
      // this.filterResponses()
    });


    this.httpClient.get('assets/other/responses_residents.csv', { responseType: 'text' }).subscribe(data => {
      const rows = data.split("\n");
      const headers = rows[0].split(';');
      for (let index = 1; index < headers.length; index++) {
        const element = headers[index];
        const obj = {
          id: index - 1,
          name: element
        }
        this.variables_residents.push(obj);
        if (element.startsWith('Ποιος είναι ο κύριος τρόπος μετακίνησής σας') || element.startsWith('Φύλο') || element.startsWith('Σε ποιο Δημοτικό Διαμέρισμα')) {
          this.filterVariables_residents.push(element);
        }
      }
      for (let index = 1; index < rows.length - 1; index++) {
        const element = rows[index];
        const response: any = {};
        const properties = element.split(';')
        for (let j in headers) {
          response[headers[j]] = properties[j]
        }
        this.responses_residents.push(response);
      }
      this.filterResponses()
    });



  }

  filterResponses() {
    const rawData: any[] = [];
    const stackedRawData: any[] = [];
    const values: any[] = [];
    let labels: any[] = [];
    // let labelsStacked: any[] = [];
    let filteredData: any[] = [];

    if (this.selectedChartType === 1 || this.selectedFilterValues.length < 2) {
      this.stackedBar = false;
    }


    for (let index = 0; index < this.selectedFilterValues.length; index++) {
      const element = this.selectedFilterValues[index];
      stackedRawData.push({
        label: element,
        data: []
      })
    }


    let responses = [];
    let variables = [];
    if (this.selectedRespondents === 2) {
      this.graphTitle = this.variables_students[this.selectedVariable]
      responses = this.responses_students;
      variables = this.variables_students;
    }
    else {
      this.graphTitle = this.variables_residents[this.selectedVariable]
      responses = this.responses_residents;
      variables = this.variables_residents;
    }


    if (this.selectedFilterValues.length !== 0 && this.stackedBar === false) {
      responses.filter((item: any) => {
        if (this.selectedFilterValues.includes(item[this.selectedFilterVariable])) {
          filteredData.push(item)
        }
      })
    }
    else {
      filteredData = responses;
    }



    for (let index = 0; index < filteredData.length; index++) {
      const element = filteredData[index];

      if (this.stackedBar) {
        for (let indexS = 0; indexS < stackedRawData.length; indexS++) {
          const elementS = stackedRawData[indexS];
          if (elementS.label === element[this.selectedFilterVariable]) {
            elementS.data.push(element[variables[this.selectedVariable].name])
          }
        }

      }
      rawData.push(element[variables[this.selectedVariable].name])
    }

    if (this.graphTitle.name.startsWith('Σημαντικότητα')) {
      labels = ['1 (Καθόλου σημαντικό)', '2', '3', '4', '5 (Πάρα πολύ σημαντικό)']
    }
    else if (this.graphTitle.name.startsWith('Πως επηρεάζει ο παράγοντας')) {
      labels = ['1 (Καθόλου)', '2', '3', '4', '5 (Πάρα πολύ)']
    }
    else {
      labels = Array.from(new Set<string>(rawData));
      labels.sort();
      labels = labels.filter((str) => str !== '');
    }


    const stackedFrequency: any[] = [];

    for (let index = 0; index < stackedRawData.length; index++) {
      const element = stackedRawData[index];

      const newData = element.data.reduce((prev: any, cur: any) => {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
      }, {});

      delete newData[""];

      if (Object.keys(newData).length !== labels.length) {
        for (let indexL = 0; indexL < labels.length; indexL++) {
          const elementL = labels[indexL];
          if (!newData[elementL]) {
            newData[elementL] = 0;
          }
        }
      }
 

      let labelsStacked = Object.keys(newData).sort();
      const valuesStacked: any[] = [];
      for (let index = 0; index < labelsStacked.length; index++) {
        const element = labelsStacked[index];
        valuesStacked.push(newData[element])
      }

      let color = this.random_rgb();
      let backgroundColor = 'rgba(' + color + ', 0.5)';
      let borderColor = 'rgba(' + color + ', 1)';
      stackedFrequency.push({
        label: element.label,
        data: valuesStacked,

        backgroundColor: backgroundColor,
        borderColor: borderColor,
        fill: '-1'
      })
    }

  

    const frequency = rawData.reduce((prev, cur) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
    delete frequency[""];
    const sortedFrequency: any[] = [];

    if (this.graphTitle.name.startsWith('Σημαντικότητα')) {
      const labelsForSort = [1,2,3,4,5]
      for (let index = 0; index < labelsForSort.length; index++) {
        const element = labelsForSort[index];
        sortedFrequency.push(frequency[element])
      }
    }
    else if (this.graphTitle.name.startsWith('Πως επηρεάζει ο παράγοντας')) {
      const labelsForSort = [1,2,3,4,5]
      for (let index = 0; index < labelsForSort.length; index++) {
        const element = labelsForSort[index];
        sortedFrequency.push(frequency[element])
      }
    }
    else {
      for (let index = 0; index < labels.length; index++) {
        const element = labels[index];
        sortedFrequency.push(frequency[element])
      }
    }



    const frequencyForPie = sortedFrequency;
    if (this.selectedRespondents === 2 && this.selectedVariable === 58) {
      this.showStudentsWishes = true;
      this.studentsWishes = [];
      this.studentsWishes = this.shuffle(labels);
    }
    else {
      this.showStudentsWishes = false;
    }
    if (this.selectedChartType === 1) {
      this.initChart(labels, frequencyForPie);

    }
    else {
      if (this.stackedBar) {
        this.initChart(labels, stackedFrequency);
      }
      else {
        this.initChart(labels, frequencyForPie);
      }

    }

  }

  selectAllValues() {
    if (this.allSelected) {
      this.selectValues.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectValues.options.forEach((item: MatOption) => item.deselect());
    }
  }

  initChart(labels: string[], values: any[]): void {

    // const   totalizer = {
    //   id: 'totalizer',

    //   beforeUpdate: (chart: any) => {
    //     let utmost: any = {};
    //     let stacktotal: any = {};
    //     chart.data.datasets.forEach((dataset: any, datasetIndex: any) => {
    //       if (chart.isDatasetVisible(datasetIndex)) {

    //         utmost[dataset.stack] = datasetIndex;

    //         dataset.data.forEach((value: any, index: any) => {
    //           if (stacktotal[dataset.stack]) {
    //             stacktotal[dataset.stack][index] = (stacktotal[dataset.stack][index] || 0) + value;
    //           } else {
    //             stacktotal[dataset.stack] = [];
    //             stacktotal[dataset.stack][index] = value;
    //           }
    //         })
    //       }
    //     });

    //     console.log(JSON.stringify(stacktotal));

    //     chart.$totalizer = {
    //       utmost: utmost,
    //       stacktotal: stacktotal
    //     }
    //   }
    // }
    if (this.responsesChart) {
      this.responsesChart.destroy();
    }
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];

    for (let index = 0; index < labels.length; index++) {
      const element = labels[index];
      let color = this.random_rgb();
      backgroundColors.push('rgba(' + color + ', 0.5)');
      borderColors.push('rgba(' + color + ', 1)');
    }

    this.responsesChart = new Chart(this.graphCanvas?.nativeElement, {
      plugins: [ChartDataLabels],
      type: this.selectedChartType === 2 ? 'radar' : this.selectedChartType === 1 ? 'pie' : 'bar',
      options: {
        maintainAspectRatio: false,
        // interaction: {
        //   mode: 'index'
        // },
        responsive: true,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                let sum = 0;
                let indexOfLabel = 0;

                indexOfLabel = context.chart.data.labels.indexOf(context.label);

                if (context.chart.data.datasets.length > 1) {
                  context.chart.data.datasets.forEach((el: any) => {
                    sum += el.data[indexOfLabel]
                  });
                }
                else {
                  sum = context.chart.data.datasets[0].data.reduce((partialSum: any, a: any) => partialSum + a, 0);
                }



                let percentage = '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null && typeof context.parsed.y !== 'undefined') {
                  // console.log(context.parsed.y)
                  percentage = ((context.parsed.y / sum) * 100).toFixed(2);
                  label += context.parsed.y;
                  label += ' (' + percentage + '%)'
                }
                if (context.parsed.r !== null && typeof context.parsed.r !== 'undefined') {
                  percentage = ((context.parsed.r / sum) * 100).toFixed(2);
                  label += context.parsed.r;
                  label += ' (' + percentage + '%)'
                }
                return label;
              }
            }
          },
          filler: {
            propagate: false
          },
          // 'samples-filler-analyser': {
          //   target: 'chart-analyser'
          // },
          datalabels: {
            clamp: true,
            display: 'auto',
            font: {
              family: "'Roboto Mono', monospace",
              weight: 'bold',
              size: 14,
            },
            // formatter: (value, ctx) => {
            //   console.log(ctx)
            //   let percentage = '0%';
            //   let dataArr;
            //   let count = 0;
            //   // for (let index = 0; index < ctx.chart.data.datasets.length; index++) {
            //   ctx.chart.data.datasets.forEach(element => {
            //     let sum = 0;
            //     // count++
            //     // const element = ctx.chart.data.datasets[index];
            //     // console.log(element)

            //     if (this.stackedBar) {
            //       dataArr = Object.values(element.data);
            //       dataArr.map(data => {
            //         sum += Number(data);
            //       });
            //       for (let index = 0; index < dataArr.length; index++) {
            //         const elementS: number = +dataArr[count];
            //         console.log(elementS)
            //         percentage = (elementS * 100 / sum).toFixed(2) + '%';
            //         count++
            //         break;
            //         // return percentage;
            //       }
            //     }
            //     else {
            //       dataArr = element.data;
            //       dataArr.map(data => {
            //         sum += Number(data);
            //       });
            //       percentage = (value * 100 / sum).toFixed(2) + '%';
            //       // return percentage;
            //     }
            //     // console.log(dataArr)

            //     // console.log(sum)
            //     // console.log(value)

            //     console.log(percentage)
            //     return percentage;
            //   })
            //   return percentage;

            // },
            color: '#333333',
            formatter: (value, ctx) => {

              let utmost: any = {};
              let stacktotal: any = {};
              let allValues: any[] = [];
              ctx.chart.data.datasets.forEach((dataset: any, datasetIndex: any) => {

                if (ctx.chart.isDatasetVisible(datasetIndex)) {

                  utmost[dataset.label] = datasetIndex;
                  allValues = [];
                  let id: number = 0;
                  Object.values(dataset.data).forEach((value: any, index: any) => {

                    allValues.push(id);
                    id++;

                    if (stacktotal[dataset.label]) {
                      stacktotal[dataset.label][index] = ((stacktotal[dataset.label][index] || 0) + value);

                    } else {
                      stacktotal[dataset.label] = [];
                      stacktotal[dataset.label][index] = value;
                    }
                  })

                }
                // console.log(stacktotal);
              });
              if (this.stackedBar) {
                for (let index = 0; index < allValues.length; index++) {
                  const element = allValues[index];
                  let sum = 0;
                  Object.values(stacktotal).forEach((el: any, id: any) => {
                    sum = sum + el[index];
                  })
                  Object.values(stacktotal).forEach((el: any, id: any) => {
                    // console.log(sum)
                    // console.log(el[index])
                    el[index] = el[index] / sum;
                  })

                }
                return (stacktotal[ctx.dataset.label][ctx.dataIndex] * 100).toFixed(2) + '%';
              }
              else {
                return (stacktotal[ctx.dataset.label][ctx.dataIndex] * 100 / stacktotal[ctx.dataset.label].reduce((partialSum: number, a: number) => partialSum + a, 0)).toFixed(2) + '%';
              }



            },
            // align: 'end',
            // anchor: 'end',
            // display: function (ctx) {
            //   return ctx.chart.$totalizer.utmost[ctx.dataset.stack] === ctx.datasetIndex;
            // }
          }
        },
      },
      data: {
        labels: labels,
        datasets: !this.stackedBar ?
          [
            {
              // barPercentage: 0.9,
              // categoryPercentage: 0.9,
              label: this.lang === 'en' ? "# of persons" : "αριθμός ερωτηθέντων",
              data: values,
              // backgroundColor: ["rgba(244, 67, 54, 0.25)", "rgba(156, 39, 176, 0.25)", "rgba(33, 150, 243, 0.25)", "rgba(0, 150, 136, 0.25)", "rgba(255, 235, 59, 0.25)", "rgba(255, 152, 0, 0.25)"],
              // borderColor: ["rgba(244, 67, 54, 1)", "rgba(156, 39, 176, 1)", "rgba(33, 150, 243, 1)", "rgba(0, 150, 136, 1)", "rgba(255, 235, 59, 1)", "rgba(255, 152, 0, 1)"],
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 2,
              borderRadius: 2,
              // spanGaps: falses 
            },
          ] :
          values
        ,
      },
    });



  }

  getFilterValues(filter: any) {
    let responses = [];
    if (this.selectedRespondents === 2) {
      responses = this.responses_students;
    }
    else {
      responses = this.responses_residents;
    }
    this.filterVariableValues = [...new Set(responses.map(item => item[filter]))];
    this.filterVariableValues = this.filterVariableValues.filter((str) => str !== '');

  }

  resetFilters() {
    if (this.selectedRespondents === 2) {
      this.selectedVariable = 59;
    }
    else {
      this.selectedVariable = 61;
    }
    this.selectedFilterValues = [];
    this.selectedFilterVariable = '';
    this.selectedChartType = 0;
    this.stackedBar = false;
    this.filterResponses();
  }

  random_rgb() {
    var o = Math.round, r = Math.random, s = 255;
    return o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s);
  }

  shuffle(array: any) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }


}
