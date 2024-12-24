export default function (task) {
  const parentName = task.parent?.get('name');
  if (parentName && task.name === 'General') {
    return parentName;
  } else {
    return task.name;
  }
}
