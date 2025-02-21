export default function ({ name }) {
  const parts = name.split(' ');

  return `${parts[0]} ${parts
    .slice(1)
    .map((part) => part[0])
    .join('')}`;
}
