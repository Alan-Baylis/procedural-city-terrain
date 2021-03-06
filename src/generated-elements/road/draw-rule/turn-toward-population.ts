import {BaseDrawRule} from "./base-draw-rule";
import {DrawRule} from "./draw-rule";
import {Turtle} from "../turtle";
import {Segment} from "../lsystem";
import {vec2} from "gl-matrix";
import {Terrain} from "../../terrain";
let Prando = require('prando').default;

export class TurnTowardPopulation extends BaseDrawRule implements DrawRule {
  prando: any;
  terrain: Terrain;
  maxTurnAngle: number;

  constructor(options: {seed: number, terrain: Terrain, maxTurnAngle: number}) {
    super(options);
    this.prando = new Prando(options.seed);
    this.terrain = options.terrain;
  }

  draw(turtle: Turtle, turtleStack: Turtle[], segments: Segment[], options: string) {
    //default to the current turtle roll angle
    let maxAngle:number = this.options.maxTurnAngle;

    let bestDir = turtle.dir;
    let highestSum = this.checkPopulationAtDirection(turtle, turtle.dir);

    //get five random angles to check
    for(let i = 0; i < 5; i++) {
      let newDir: number = turtle.dir + this.prando.next(0, maxAngle * 2) - maxAngle;
      let sum = this.checkPopulationAtDirection(turtle, newDir);
      if(sum > highestSum) {
        bestDir = newDir;
        highestSum = sum;
      }
    }

    turtle.dir = bestDir;
    return turtle;
  }


  /**
   * Sum the population density from the turtle along points along a ray
   * @param turtle
   * @param angle
   */
  checkPopulationAtDirection(turtle: Turtle, newDir: number) : number {

    let dist = 20;
    let sum = 0;
    for(let i: number = 1; i < 6; i++) {
      let checkPoint: vec2 = vec2.create();
      checkPoint[0] = turtle.pos[0] + Math.cos(newDir) * dist;
      checkPoint[1] = turtle.pos[1] + Math.sin(newDir) * dist;
      sum += this.terrain.getPopulationDensity(checkPoint) / i;
    }

    return sum;
  }
}