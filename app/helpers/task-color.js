export default function (task) {
  return task.color ?? task.parent?.get('color');
}
