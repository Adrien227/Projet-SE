import { Task } from './Task';
export class Graph {
    tasks: Task[];
    coordAlreadyUse: Map <number, number>;

    constructor(tasks: Task[]) {
      this.tasks = tasks;
      this.coordAlreadyUse = new Map <number, number>();
    }

    addCoord(x: number) {
      if (this.coordAlreadyUse.has(x)) {
        this.coordAlreadyUse.set(x, this.coordAlreadyUse.get(x) + 1);
      } else {
        this.coordAlreadyUse.set(x, 1);
      }
    }

    getY(x: number) {
      if (this.coordAlreadyUse.has(x)) {
        return this.coordAlreadyUse.get(x);
      } else {
        return 0;
    }
  }

  getEndTime() {
      let maxEndTime = 0;

      this.tasks.forEach((task: Task) => {
        const tempEndTime = task.calculateEndTime();
        if (tempEndTime > maxEndTime) {
          maxEndTime = tempEndTime;
        }
      });

      return maxEndTime;
  }
}
