import React from 'react';
import ColorSystem from './components/ColorSystem';
import DefaultColorContext from './DefaultColorContext';
import { white, asHslColor, colorToHsl } from './colors';
import type { Color } from './colors';


const useState = React.useState;

type Colors = React.ComponentProps<typeof ColorSystem>['colors'];

let exampleColors: Colors = {
  primary: [
    { type: 'rgb',
      value: {
        r: 255,
        g: 0,
        b: 0,
      },
    },
    { type: 'rgb',
      value: {
        r: 0,
        g: 255,
        b: 0,
      },
    },
    { type: 'rgb',
      value: {
        r: 0,
        g: 0,
        b: 255,
      },
    },
  ],
  neutral: [
  ],
  accents: [
  ],
};

type DesignSystem = {
  colorSystem: Colors,
}

function makeDesignSystem(): DesignSystem {
  return {
    colorSystem: {
      primary: [],
      neutral: [],
      accents: [],
    }
  }
}

async function loadDesignSystem(): Promise<DesignSystem|null> {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  return new Promise((resolve, reject) => {
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;

      if (!files || !files.length) {
        return reject(null);
      }

      const file = files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const target = e.target as FileReader;
        const result = target.result;

        if (typeof result !== 'string') {
          return reject(null);
        }

        return resolve(JSON.parse(result));
      });

      reader.addEventListener('error', () => {
        return reject(null);
      });

      reader.readAsText(file);
    });
    input.click();
  });
}

function saveAsFile(s: string, type: string, filename: string) {
  const blob = new Blob([s], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('download', filename);
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function saveDesignSystem(system: DesignSystem) {
  const json = JSON.stringify(system);
  saveAsFile(json, 'application/json', 'design-system.json');
}

function exportDesignSystem(system: DesignSystem) {
  function exportColors(colors: Color[], prefix: string) {
    if (!colors.length) {
      return null;
    }
    const first = asHslColor(colors[0]);
    const last = asHslColor(colors[colors.length - 1]);
    // Sort lightest to darkest
    if (first.value.l > last.value.l) {
      colors = colors.slice().reverse();
    }
    console.log('mapping colors', colors);
    return colors.map((c, i) => {
      return `  --color-${prefix}-${(i+1)*100}: ${colorToHsl(c)};`;
    }).join('\n');
  }

  const colorSystems = [
    exportColors(system.colorSystem.primary, 'primary'),
    exportColors(system.colorSystem.neutral, 'neutral'),
  ].filter(v => !!v);
  const css = `body {\n${colorSystems.join('\n')}\n}`
  saveAsFile(css, 'text/css', 'design-system.css');
}

function App() {
  const [ colorSystem, setColorSystem ] = useState(exampleColors);
  function setDesignSystem(system: DesignSystem) {
    setColorSystem(system.colorSystem);
  }
  return (<>
    <DefaultColorContext.Provider value={white}>
      <header>
        <nav>
          <ul>
            <li><button onClick={() => {
              if (window.confirm('Are you sure you want to reset your system and start over? All unsaved changes will be lost.')) {
                setDesignSystem(makeDesignSystem());
              }
            }}>Reset</button></li>
            <li><button onClick={() => {
              saveDesignSystem({ colorSystem });
            }}>Save</button></li>
            <li><button onClick={async () => {
              const designSystem = await loadDesignSystem();
              if (designSystem) {
                setDesignSystem(designSystem);
              }
            }}>Load</button></li>
            <li><button onClick={() => {
              exportDesignSystem({ colorSystem });
            }}>Export</button></li>
          </ul>
        </nav>
      </header>
      <main>
        <section>
          <ColorSystem colors={colorSystem} onUpdateColorSystem={setColorSystem}/>
        </section>
      </main>
    </DefaultColorContext.Provider>
  </>);
}

export default App;
