export default function (task) {
  const parentName = task.parent?.get('name');
  if (parentName) {
    if (task.name == 'General') {
      return parentName;
    } else {
      return `${task.name} (${parentName})`;
    }
  } else {
    return task.name;
  }
}
