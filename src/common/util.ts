const getElementByIdOrThrow = function (id: string) {
  const el = document.getElementById(id);
  if (!el) {
    throw Error(`Failed to get element ${id}`);
  }

  return el;
};

export { getElementByIdOrThrow };
