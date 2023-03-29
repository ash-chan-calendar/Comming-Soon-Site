const getElementByIdOrThrow = function (id: string) {
  const el = document.getElementById(id);
  if (!el) {
    throw Error(`Failed to get element ${id}`);
  }

  return el;
};

const addStringLeftToLength = function (
  str: string,
  length: number,
  pad: string = ' '
) {
  return (
    pad
      .repeat(Math.floor((length - str.length) / pad.length))
      .slice(0, length - str.length) + str
  );
};

export { addStringLeftToLength, getElementByIdOrThrow };
