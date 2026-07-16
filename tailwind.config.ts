import type { Config } from 'tailwindcss';
const config: Config = { darkMode: 'class', content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { civic: { 50:'#eef9ff', 500:'#0ea5e9', 700:'#0369a1' } }, boxShadow:{ glow:'0 24px 80px rgba(14,165,233,.22)'}, animation:{ float:'float 7s ease-in-out infinite'}, keyframes:{float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-14px)'}}}}}, plugins: [] };
export default config;
