/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14120F',
          50: '#F5F3EE',
          900: '#0D0B08',
        },
        surface: {
          DEFAULT: '#1C1912',
          raised: '#242018',
          line: '#332C1F',
        },
        rust: {
          DEFAULT: '#B8662E',
          light: '#D3823F',
          dim: '#8A4E24',
        },
        moss: {
          DEFAULT: '#5A6B41',
          light: '#7A8E5A',
          dim: '#3C4A2C',
        },
        tek: {
          DEFAULT: '#3FB4B6',
          light: '#6BD2D4',
          dim: '#256163',
        },
        bone: {
          DEFAULT: '#EAE3D2',
          dim: '#A79C86',
          faint: '#6E6656',
        },
        danger: '#B9482F',
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(234,227,210,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(234,227,210,0.035) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}
