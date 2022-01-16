import {
  getValInRangeFromZeroToOne,
  getValueInRangeFromRangeInOne,
} from "@hzn/utils/functions";

export interface AnimationData {
  duration: number;
}

export interface AnimationFrameData<T> {
  originalData: T;
  currentData: T;
  endData: T;
  timeSpent: number;
  isAnimating: boolean;
}

export interface AnimationProps<T> {
  from: T;
  to: T;
  duration: number;
  onFrame: OnFrame<T>;
  onEnd: OnFrame<T>;
}

export type OnFrame<T> = (data: AnimationFrameData<T>) => void;

export default class Animation<T extends Record<keyof T, number>> {
  private from: T;
  private to: T;
  private duration: number;
  private onFrame: OnFrame<T>;
  private onEnd: OnFrame<T>;

  private timeSpent: number = 0;
  private lastTime: number = 0;
  private animationFrame: number = 0;
  private dataKeys: Array<keyof T> = [];
  private now: T;
  public isAnimating: boolean = false;

  constructor(props: AnimationProps<T>) {
    this.from = { ...props.from };
    this.to = { ...props.to };
    this.duration = props.duration;
    this.onFrame = props.onFrame;
    this.onEnd = props.onEnd;

    this.now = { ...props.from };
    this.dataKeys = Object.keys(props.from) as (keyof T)[];
  }

  cancelAnimation = (): AnimationFrameData<T> => {
    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.isAnimating = false;
    return this.getAnimationFrameData();
  };

  private getAnimationFrameData = (): AnimationFrameData<T> => {
    return {
      originalData: this.from,
      currentData: this.now,
      endData: this.to,
      timeSpent: this.timeSpent,
      isAnimating: this.isAnimating,
    };
  };

  private drawFrame = (time: number) => {
    if (!this.lastTime) {
      this.lastTime = time;
    }
    let dt = time - this.lastTime;
    this.timeSpent += dt;
    this.lastTime = time;
    if (Math.round(this.timeSpent) >= this.duration) {
      this.onEnd(this.cancelAnimation());
    } else {
      const timeRangeValue = getValInRangeFromZeroToOne(
        0,
        this.duration,
        this.timeSpent
      );

      this.dataKeys.forEach((key) => {
        this.now[key] = getValueInRangeFromRangeInOne(
          this.from[key],
          this.to[key],
          timeRangeValue
        ) as T[keyof T];
      });

      this.onFrame(this.getAnimationFrameData());
      this.animationFrame = window.requestAnimationFrame(this.drawFrame);
    }
  };

  animate = () => {
    this.isAnimating = true;
    this.animationFrame = window.requestAnimationFrame(this.drawFrame);
  };
}
