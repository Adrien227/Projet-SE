import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Task } from '../model/Task';
import { Graph } from '../model/Graph';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('canvas')
  canvasElement: ElementRef<HTMLCanvasElement>;
  canvas: CanvasRenderingContext2D;

  @Input() graph: Graph;

  heightTask = 50;
  widthTask = 50;
  pixelStartColumn: number[] = [10, 160, 310, 460, 610, 760, 910, 1060, 1210, 1360, 1510];
  pixelStartLine: number[] = [10, 160, 310, 460, 610, 760, 910, 1060, 1210, 1360, 1510];



  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.graph.currentValue) {
      this.resetGraph();
      this.drawGraph(0);
    }
  }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.canvas = this.canvasElement.nativeElement.getContext('2d');
  }

  drawGraph(time: number) {
    this.resetGraph();
    if (this.graph.tasks.length > 5){
      this.canvasElement.nativeElement.height += 150;
    }
    this.graph.tasks.forEach((task: Task) => {
      const maxDistanceTask = task.calculateMaxDistance();
      this.drawTask(task, maxDistanceTask, this.graph.getY(maxDistanceTask), time);
    });

    this.graph.tasks.forEach((taskFrom: Task) => {
      taskFrom.liaison.sortant.forEach((taskTo: Task) => {
        this.drawLiaison(taskFrom, taskTo);
      });
    });
  }

  resetGraph() {
    this.graph.coordAlreadyUse.clear();
    this.canvas.clearRect(0, 0, 999999, 999999);
  }

  drawTask(task: Task, column: number, line: number, time: number) {
    // Affection et enregistrement de la position de la tache
    task.pos.x = this.pixelStartColumn[column];
    task.pos.y = this.pixelStartLine[line];
    this.graph.addCoord(column);

    // Carré vert avancement de la tâche
    if (time && time > task.calculateStartTime() && time < task.calculateEndTime()){
      const pourcentageAvancement = ((time - task.calculateStartTime()) * 100 / task.duree) / 100;
      this.canvas.fillStyle = '#00796B';
      this.canvas.fillRect(task.pos.x, task.pos.y + ((1 - pourcentageAvancement) * this.heightTask), this.widthTask, pourcentageAvancement * this.heightTask);
    } else if (time && time >= task.calculateEndTime()) {
      this.canvas.fillStyle = '#00796B';
      this.canvas.fillRect(task.pos.x, task.pos.y, this.widthTask, this.heightTask);
    }

    // Dessin de la tâche
    this.canvas.strokeStyle = '#000000';
    this.canvas.strokeRect(task.pos.x, task.pos.y, this.widthTask, this.heightTask);

    // Affichage et centrage du texte (2 caractères maximum)
    this.canvas.font = '24px serif';
    if (task.id < 10) {
      this.canvas.strokeText(task.id.toString(),
          (task.pos.x + (this.widthTask / 2)) - 6,
          (task.pos.y + (this.heightTask / 2)) + 8,
          50);
    } else {
      this.canvas.strokeText(task.id.toString(),
          (task.pos.x + (this.widthTask / 2)) - 12,
          (task.pos.y + (this.heightTask / 2)) + 8,
          50);
    }

    // Enregistrement des points d'accroches
    task.pointDaccrocheEntrant.x = task.pos.x;
    task.pointDaccrocheEntrant.y = (task.pos.y + (this.widthTask / 2));
    task.pointDaccrocheSortant.x = task.pos.x + this.widthTask;
    task.pointDaccrocheSortant.y = task.pos.y + (this.widthTask / 2);
    
  }

  drawLiaison(taskFrom: Task, taskTo: Task){
    const headlen = 10;
    const angle = Math.atan2(taskTo.pointDaccrocheEntrant.y - taskFrom.pointDaccrocheSortant.y, taskTo.pointDaccrocheEntrant.x - taskFrom.pointDaccrocheSortant.x);

    
    // Trace la ligne de la tâche sortante à la tâche entrante
    this.canvas.strokeStyle = '#000000';
    this.canvas.beginPath();
    this.canvas.moveTo(taskFrom.pointDaccrocheSortant.x, taskFrom.pointDaccrocheSortant.y);
    this.canvas.lineTo(taskTo.pointDaccrocheEntrant.x, taskTo.pointDaccrocheEntrant.y);
    this.canvas.stroke();

    // "Trace" un des cotés de la pointe de flèche (sans tracer réellement le chemin)
    this.canvas.fillStyle = '#000000';
    this.canvas.beginPath();
    this.canvas.moveTo(taskTo.pointDaccrocheEntrant.x, taskTo.pointDaccrocheEntrant.y);
    this.canvas.lineTo(taskTo.pointDaccrocheEntrant.x - headlen * Math.cos(angle - Math.PI / 7), taskTo.pointDaccrocheEntrant.y - headlen * Math.sin(angle - Math.PI / 7));

    // "Trace" un autre côté (sans tracer réellement le chemin)
    this.canvas.lineTo(taskTo.pointDaccrocheEntrant.x - headlen * Math.cos(angle + Math.PI / 7), taskTo.pointDaccrocheEntrant.y - headlen * Math.sin(angle + Math.PI / 7));

    // Ferme la pointe de flèche (sans tracer réellement le chemin)
    this.canvas.lineTo(taskTo.pointDaccrocheEntrant.x, taskTo.pointDaccrocheEntrant.y);
    this.canvas.lineTo(taskTo.pointDaccrocheEntrant.x - headlen * Math.cos(angle - Math.PI / 7), taskTo.pointDaccrocheEntrant.y - headlen * Math.sin(angle - Math.PI / 7));

    // Trace réellement et remplit la pointe de flèche
    this.canvas.stroke();
    this.canvas.fill();
  }

}
