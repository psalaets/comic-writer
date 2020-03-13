import { mark, stop } from 'marky';

export function start(name: string) {
  mark(name);
}

export function end(name: string) {
  stop(name);
}
