import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


enum State {
  Stopped,
  SetupInitited,
  Running
}

@Component({
  selector: 'app-insite-nest-plot',
  templateUrl: './insite-nest-plot.component.html',
  styleUrls: ['./insite-nest-plot.component.css']
})
export class InsiteNestPlotComponent implements OnInit {
  // Visualization
  public graph: any;
  public from: number = 0;
  public to: number = 10000;

  // User options
  public updating: boolean = true;
  public following: boolean = false;
  public url: string;

  // Internal
  public state = State.Stopped;
  public currentTime: number = undefined;
  public populationIds: number[] = [];
  public populationSpikes;
  public graphData = [];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.url = 'http://' + (window.location['hostname'] ? window.location['hostname'] : 'localhost');

    this.graph = {
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
    };
    this.init();
  }

  init() {
    console.log('Init');
    setInterval(() => this.update(), 100);
  }

  reset() {
    if (this.state !== State.Stopped) {
      console.log('Reset');
      this.state = State.Stopped;
      this.currentTime = undefined;
      this.populationIds = [];
      this.graphData = [];
    }
  }

  update() {
    this.http.get(this.url + ':8080/nest/simulation_time_info').subscribe(res => {
      if (res.hasOwnProperty('current')) {
        const newTime = parseFloat(res['current']);
        if (newTime < this.currentTime) {
          // Appearently the simulation has been restarted
          this.reset();
        }
        if (this.state !== State.Running) {
          this.setupSimulation();
        } else {
          this.querySpikes(this.currentTime || 0, newTime);
          this.currentTime = newTime;
        }
      }
    }, error => {
      this.reset();
    });
  }

  setupSimulation() {
    if (this.state !== State.Stopped) {
      return;
    }

    this.state = State.SetupInitited;
    this.http.get(`${this.url}:8080/nest/populations`).subscribe(populationIds => {
      this.populationIds = populationIds as number[];
      for (const x of this.populationIds) {
        this.graphData.push({ x: [], y: [], type: 'scattergl', mode: 'markers', hoverinfo: 'none' });
      }
      this.graph.data = this.graphData;
      this.state = State.Running;
    }, error => {
      this.reset();
    });
  }

  querySpikes(from: number, to: number) {
    if (this.state !== State.Running) {
      throw new Error('this method should only be called when running');
    }
    if (from < to) {
      for (const populationId of this.populationIds) {
        this.http.get(`${this.url}:8080/nest/population/$${populationId}/spikes`).subscribe(spikes => {
          console.log(`${this.url}:8080/nest/population/$${populationId}/spikes`);
          const simulationTimes = spikes['simulation_times'] as number[];
          const gids = spikes['gids'] as number[];
          console.log(spikes);
          const populationIndex = this.populationIds.indexOf(populationId);
          console.log(populationId);
          console.log(this.populationIds);
          console.log(populationIndex);
          for (let i = 0; i < simulationTimes.length; ++i) {
            (this.graphData[populationIndex].x as number[]).push(simulationTimes[i]);
            (this.graphData[populationIndex].y as number[]).push(gids[i]);
          }
          console.log(this.graphData);
          this.graph.data = this.graphData;
        }, error => {
          this.reset();
        });
      }
    }
  }

  spikes() {
    // if (this.following) {
    //   this.from = Math.max(0, this.currentTime - 900)
    //   this.to = Math.max(1000, this.currentTime + 100)
    //   this.graph.layout.xaxis.range = [this.from, this.to];
    // }
    // var from = Math.max(this.from - 50, 0);
    // var to = Math.max(this.to + 50, 0);
    // let params = new HttpParams().set('from', from.toString()).set('to', to.toString());
    // this.http.get(this.url + ':8080/nest/spikes', { params: params }).subscribe(res => {
    //   if (res.hasOwnProperty('simulation_times')) {
    //     var simulation_times = res['simulation_times'];
    //     var gids = res['gids'];
    //     var data = [
    //       { x: [], y: [], type: 'scattergl', mode: 'markers', hoverinfo: 'none' },
    //       { x: [], y: [], type: 'scattergl', mode: 'markers', hoverinfo: 'none' },
    //     ];
    //     gids.forEach((gid, gidx) => {
    //       var pidx = gid <= (625*4) ? 0 : 1;
    //       data[pidx].x.push(simulation_times[gidx]);
    //       data[pidx].y.push(gid);
    //     })
    //     this.graph.data = data;

    //     if (this.running && this.updating) {
    //       setTimeout(() => this.update(), 100)
    //     }
    //   }
    // }, error => {
    //   console.log('error', error)
    //   this.error = error;
    //   this.running = false;
    // });
  }

  onMouseDown(event) {
    this.following = false;
  }

  onRelayout(event) {
    // if (event.hasOwnProperty('xaxis.range[0]')) {
    //   this.from = parseInt(event['xaxis.range[0]']);
    //   this.to = parseInt(event['xaxis.range[1]']);
    //   if (this.updating && !this.running) {
    //     this.update()
    //   }
    // }
  }


}
