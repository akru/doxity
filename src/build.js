import compile from './compile';
import publish from './publish';

export default function (args) {
  compile(args);
  publish(args);
}
