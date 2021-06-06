import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatExpansionPanel } from '@angular/material/expansion';
import {Task} from '../model/Task';
import {Graph} from '../model/Graph';

@Component({
  selector: 'app-graph-form',
  templateUrl: './graph-form.component.html',
  styleUrls: ['./graph-form.component.scss']
})
export class GraphFormComponent implements OnInit {
  @Input() graphForCode: Graph;
  tasks: Task[];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  time = 0;
  animation;

  @Output() tasksEventEmitter: EventEmitter<Task[]> = new EventEmitter<Task[]>();
  @Output() graphAtTime: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    this.tasks = [];
    this.firstFormGroup = new FormGroup({
      tasks: new FormArray([], Validators.required)
    });
    this.secondFormGroup = new FormGroup({
      liaisons: new FormArray([])
    });
  }

  addTask(matExpansionPanel: MatExpansionPanel) {
    matExpansionPanel.open();
    const tasksFormArray: FormArray = this.firstFormGroup.get('tasks') as FormArray;
    tasksFormArray.push(new FormGroup({
      id: new FormControl(tasksFormArray.length + 1,
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.max(99)]),
      name: new FormControl('Tâche ' + (tasksFormArray.length + 1),
        Validators.required),
      duree: new FormControl(1,
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.max(99)]),
    }));

    this.updateTasks();
  }

  deleteTask(index: number) {
    (this.firstFormGroup.get('tasks') as FormArray).removeAt(index);

    this.updateTasks();
  }

  addLiaison() {
    const liaisonsFormArray: FormArray = this.secondFormGroup.get('liaisons') as FormArray;
    this.resetAndSetLiaisons(liaisonsFormArray);

    liaisonsFormArray.push(new FormGroup({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required)
    }));
    
    this.emitTasks(); 
  }

  deleteLiaison(index: number) {
    const liaisonsFormArray: FormArray = this.secondFormGroup.get('liaisons') as FormArray;
    liaisonsFormArray.removeAt(index);

    this.resetAndSetLiaisons(liaisonsFormArray);
    this.emitTasks();
  }

  updateTasks() {
    this.tasks = this.firstFormGroup.value.tasks.map((task: Task) => {
      return new Task(task.id, task.name, task.duree);
    });
    
    this.emitTasks();
  }

  resetAndSetLiaisons(liaisonsFormArray: FormArray) {
    this.tasks.forEach((task: Task) => {
      task.liaison.entrant = [];
      task.liaison.sortant = [];
    });

    liaisonsFormArray.controls.forEach((formGroup: FormGroup) => {
      if (formGroup.valid) {
        const fromTask: Task = formGroup.value.from;
        const toTask: Task = formGroup.value.to;

        fromTask.liaison.sortant.push(toTask);
        toTask.liaison.entrant.push(fromTask);
      }
    });
  }

  onSelectionChange($event: StepperSelectionEvent) {
    if ($event.previouslySelectedIndex === 0) {
      this.tasks = this.firstFormGroup.value.tasks.map((task: Task) => {
        return new Task(task.id, task.name, Number(task.duree));
      });
    }

    this.emitTasks();
  }

  onSelectionChangeLi() {
    const liaisonsFormArray: FormArray = this.secondFormGroup.get('liaisons') as FormArray;
    this.resetAndSetLiaisons(liaisonsFormArray);
    this.emitTasks();
  }

  
  graphAtTimeEmit($event: number) {
    this.time = $event;
    this.graphAtTime.emit(this.time);
  }

  getMaxTime() {
    if (this.graphForCode !== undefined) {
      return this.graphForCode.getEndTime();
    }
  }

  startAnimation() {
    this.time = 0;
    this.graphAtTime.emit(this.time);

    const graphTime = this.graphForCode.getEndTime();
    clearInterval(this.animation);
    this.animation = setInterval(() => {
      this.time = this.time + 1;
      this.graphAtTime.emit(this.time);

      if (this.time >= graphTime) {
        clearInterval(this.animation);
      }
    }, 1000);
  }

  

  emitTasks() { // Envoie l'évenement à un autre composant, qui sait comment le traiter
    this.tasksEventEmitter.emit(this.tasks);
  }

}
