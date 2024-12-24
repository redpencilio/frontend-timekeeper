function uniqueBy(array, cmpFunc) {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = cmpFunc(item);
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
}

export { uniqueBy };
