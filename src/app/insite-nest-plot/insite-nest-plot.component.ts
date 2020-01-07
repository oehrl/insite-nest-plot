import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-insite-nest-plot',
  templateUrl: './insite-nest-plot.component.html',
  styleUrls: ['./insite-nest-plot.component.css']
})
export class InsiteNestPlotComponent implements OnInit {
  public graph: any;
  public from: number = 0;
  public to: number = 1000;
  public updating: boolean = false;
  public following: boolean = true;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.graph = {
      data: [
        { x: [], y: [], type: 'scattergl', mode: 'markers' },
        { x: [], y: [], type: 'scattergl', mode: 'markers' },
      ],
      layout: {
        width: 800,
        height: 600,
        xaxis: {range : [this.from, this.to]},
        yaxis: {fixedrange: true},
      },
      config: {
        scrollZoom: true,
      }
    }
    if (this.updating == false) {
      this.updating = true;
      this.update()
    }
  }

  update() {
    this.graph.layout.xaxis.range = [this.from, this.to];
    var url: string = 'http://localhost:8000/spikes?from=' + this.from + '&to=' + this.to;
    this.http.get(url).subscribe(res => {
      if (res.hasOwnProperty('simulation_steps')) {
        this.graph.data[0].x = res['simulation_steps'];
        this.graph.data[0].y = res['neuron_ids'];
        var endtime = parseInt(res['simulation_steps'][res['simulation_steps'].length-1]);
        if (this.following && endtime) {
          this.from = Math.max(endtime - 800, 0);
          this.to = endtime + 200;
        }
        if (this.updating) {
          setTimeout(() => this.update(), 10)
        }
      }
    }, error => {
      console.log('error', error)
      this.updating = false;
     })
  }

  onRelayout(event) {
    this.following = false;
    if (event.hasOwnProperty('xaxis.range[0]')) {
      this.from = Math.max(parseInt(event['xaxis.range[0]']),0);
      this.to = parseInt(event['xaxis.range[1]']);
      // this.update()
    }
  }


}
