import marky from 'marky';

export function start(name: string) {
  marky.mark(name);
}

export function end(name: string) {
  marky.stop(name);
}
