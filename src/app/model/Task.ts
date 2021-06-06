import { Liaison } from './Liaison';
export class Task {
    id: number;
    name: string;
    pos: XY;
    duree: number;
    liaison: Liaison;
    pointDaccrocheEntrant: XY;
    pointDaccrocheSortant: XY;

    constructor(id: number, name: string, duree: number){
        this.id = id;
        this.name = name;
        this.pos = new XY();
        this.duree = duree;
        this.liaison = new Liaison();
        this.pointDaccrocheEntrant = new XY();
        this.pointDaccrocheSortant = new XY();
    }

    calculateMaxDistance(): number {
        let tempDistance = 0;
        this.liaison.entrant.forEach((task: Task) => {
            const distanceParent = task.calculateMaxDistance();
            if (distanceParent >= tempDistance) {
                tempDistance = distanceParent + 1;
            }
        });
        return tempDistance;
    }

    calculateEndTime() {
        return this.calculateStartTime() + this.duree;
    }

    calculateStartTime() {
        let startTime = 0;
        if (this.calculateMaxDistance() !== 0) {
            this.liaison.entrant.forEach((task: Task) => {
                const maxCurrentTask = task.calculateEndTime() ;
                if (maxCurrentTask > startTime) {
                    startTime = maxCurrentTask;
                }
            });
        }
        return startTime;
    }
}

export class XY {
    x: number;
    y: number;
}
