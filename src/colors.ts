interface RgbColor {
  type: 'rgb',
  value: {
    r: number,
    g: number,
    b: number,
  }
};

interface HslColor {
  type: 'hsl',
  value: {
    h: number,
    l: number,
    s: number,
  }
}
export type Color = HslColor | RgbColor;

export const white: Color = Object.freeze({
  type: 'rgb',
  value: {
    r: 255,
    g: 255,
    b: 255,
  },
});

export const colorToHex = (color: Color) => {
  function toPaddedHex(n: number) {
    return n.toString(16).padStart(2, '0');
  }
  const { r, g, b } = asRgbColor(color).value;
  return `#${toPaddedHex(r)}${toPaddedHex(g)}${toPaddedHex(b)}`;
};

export const colorToHsl = (color: Color) => {
  const {h, l, s} = asHslColor(color).value;
  return `hsl(${h}, ${l*100}%, ${s*100}%)`;
}

export const hexToColor = (hex: string): Color => {
  const r = parseInt(hex[1] + hex[2], 16);
  const g = parseInt(hex[3] + hex[4], 16);
  const b = parseInt(hex[5] + hex[6], 16);
  return {
    type: 'rgb',
    value: {
      r,
      g,
      b,
    }
  };
}

export const asHslColor = (color: Color): HslColor => {
  function hue(r: number, g: number, b: number, delta: number, cMax: number) {
    if (delta === 0) {
      return 0;
    }

    if (cMax === r) {
      return 60 * (((g - b) / delta) % 6);
    }
    if (cMax === g) {
      return 60 * ((b - r) / delta + 2);
    }
    if (cMax === b) {
      return 60 * ((r - g) / delta + 4);
    }
    throw new Error('Invalid delta or cMax value');
  }
  switch (color.type) {
    case 'rgb':
      const r = color.value.r / 255;
      const g = color.value.g / 255;
      const b = color.value.b / 255;

      const cMax = Math.max(r, g, b);
      const cMin = Math.min(r, g, b);
      const delta = cMax - cMin;

      const l = (cMax + cMin) / 2;
      const s = delta === 0 ? 0 : delta / (1 - Math.abs(2*l-1));
      const h = hue(r, g, b, delta, cMax);

      return {
        type: 'hsl',
        value: { h, l, s }
      };
    case 'hsl':
      return color;
  }
}

export const asRgbColor = (color: Color): RgbColor => {
  switch (color.type) {
    case 'hsl':
      const { l, s, h } = color.value;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * 1 - Math.abs(((h / 60) % 2) - 1);
      const m = l - (c / 2);
      const [r, g, b] = ((c, x, h) => {
        if (h < 60) {
          return [ c, x, 0 ];
        }
        if (h < 120) {
          return [ x, c, 0 ];
        }
        if (h < 180) {
          return [ 0, c, x ];
        }
        if (h < 240) {
          return [ 0, x, c ];
        }
        if (h < 300) {
          return [ x, 0, c ];
        }
        if (h < 360) {
          return [ c, 0, x];
        }
        throw new Error('Invalid hue value');
      })(c, x, h);

      return {
        type: 'rgb',
        value: {
          r: (r + m) * 255,
          g: (g + m) * 255,
          b: (b + m) * 255,
        }
      };
    case 'rgb':
      return color;
  }
}
