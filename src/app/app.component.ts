import {Component, OnInit, ViewChild} from '@angular/core';
import {Task} from './model/Task';
import {Graph} from './model/Graph';
import {CanvasComponent} from './canvas/canvas.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ProjetSE';

  graph: Graph;
  @ViewChild(CanvasComponent) canvasComponent: CanvasComponent;

  constructor() { }

  ngOnInit(): void {
  }

  getTasksAndEmit($event: Task[]) {
    this.graph = new Graph($event);
  }

  graphAtTime(time: number) {
    this.canvasComponent.drawGraph(time);
  }
}
