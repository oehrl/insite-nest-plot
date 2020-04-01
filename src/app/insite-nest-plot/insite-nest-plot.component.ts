import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-insite-nest-plot',
  templateUrl: './insite-nest-plot.component.html',
  styleUrls: ['./insite-nest-plot.component.css']
})
export class InsiteNestPlotComponent implements OnInit {
  public graph: any;
  public from: number = 0;
  public to: number = 10000;
  public updating: boolean = true;
  public running: boolean = true;
  public following: boolean = false;
  public currentTime: number = 0;
  public url: string;
  public heartbeat: number;
  public error: any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.url = 'http://' + (window.location['hostname'] ? window.location['hostname'] : 'localhost');

    this.graph = {
      data: [
        { x: [], y: [], type: 'scattergl', mode: 'markers', hoverinfo: 'none' },
        { x: [], y: [], type: 'scattergl', mode: 'markers', hoverinfo: 'none' },
      ],
      layout: {
        width: 800,
        height: 600,
        xaxis: { range: [this.from, this.to] },
        yaxis: { fixedrange: true },
        showlegend: false,
      },
      config: {
        scrollZoom: true,
      }
    }
    this.init()
  }

  init() {
    console.log('Init')
    this.heartbeat = 3;
    this.running = true;
    this.simulationTimeInfo()
    this.update()
  }

  update() {
    this.error = null;
    this.spikes()
  }

  spikes() {
    if (this.following) {
      this.from = Math.max(0, this.currentTime - 900)
      this.to = Math.max(1000, this.currentTime + 100)
      this.graph.layout.xaxis.range = [this.from, this.to];
    }
    var from = Math.max(this.from - 50, 0);
    var to = Math.max(this.to + 50, 0);
    let params = new HttpParams().set('from', from.toString()).set('to', to.toString());
    this.http.get(this.url + ':8080/spikes', { params: params }).subscribe(res => {
      if (res.hasOwnProperty('simulation_times')) {
        var simulation_times = res['simulation_times'];
        var gids = res['gids'];
        var data = [
          { x: [], y: [], type: 'scattergl', mode: 'markers', hoverinfo: 'none' },
          { x: [], y: [], type: 'scattergl', mode: 'markers', hoverinfo: 'none' },
        ];
        gids.forEach((gid, gidx) => {
          var pidx = gid <= 10000 ? 0 : 1;
          data[pidx].x.push(simulation_times[gidx]);
          data[pidx].y.push(gid);
        })
        this.graph.data = data;

        if (this.running && this.updating) {
          setTimeout(() => this.update(), 100)
        }
      }
    }, error => {
      console.log('error', error)
      this.error = error;
      this.running = false;
    })
  }

  simulationTimeInfo() {
    this.http.get(this.url + ':8080/simulation_time_info').subscribe(res => {
      if (res.hasOwnProperty('current')) {
        if (this.currentTime == parseInt(res['current'])) {
          this.heartbeat -= 1;
        } else {
          this.heartbeat = 3;
        }
        if (this.heartbeat == 0) {
          this.running = false;
        }
        this.currentTime = parseInt(res['current']);
        if (this.running) {
          setTimeout(() => this.simulationTimeInfo(), 100)
        }

      }
    }, error => {
      console.log('error', error)
      this.error = error;
      this.running = false;
    })
  }

  onMouseDown(event) {
    this.following = false;
  }

  onRelayout(event) {
    if (event.hasOwnProperty('xaxis.range[0]')) {
      this.from = parseInt(event['xaxis.range[0]']);
      this.to = parseInt(event['xaxis.range[1]']);
      if (this.updating && !this.running) {
        this.update()
      }
    }
  }


}
