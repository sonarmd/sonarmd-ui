// Bundle budgets (V1_SPEC S1.4). Measured with size-limit's default brotli
// compression (the CDN-standard transfer size). react* and react-window are
// always external; echarts is a peer the preset externalizes by default, which
// we keep for the core checks and override for the charts check so its modular
// cost is counted.
const externals = ['react', 'react-dom', 'react-router-dom', 'react-window'];

module.exports = [
  {
    name: 'core: import { Badge } only',
    path: 'dist/index.js',
    import: '{ Badge }',
    limit: '3 kB',
    ignore: [...externals, 'echarts'],
  },
  {
    name: 'core: full non-chart surface',
    path: 'dist/index.js',
    limit: '80 kB',
    ignore: [...externals, 'echarts'],
  },
  {
    // V1_SPEC: motion + transitions + data combined <= 6 kB gz. Motion alone <= 2.5 kB.
    name: 'motion entry',
    path: 'dist/motion/index.js',
    limit: '2.5 kB',
    ignore: [...externals, 'echarts'],
  },
  {
    // V1_SPEC: transitions entry <= 2.5 kB brotli (part of the 6 kB combined budget).
    name: 'transitions entry',
    path: 'dist/transitions/index.js',
    limit: '2.5 kB',
    ignore: [...externals, 'echarts'],
  },
  {
    name: 'charts entry (incl echarts core)',
    path: 'dist/charts/index.js',
    limit: '120 kB',
    ignore: externals,
    modifyEsbuildConfig(config) {
      // The preset marks echarts (a peerDependency) external; un-externalize it
      // so the charts budget reflects the modular echarts core it pulls in.
      config.external = (config.external || []).filter(
        (dep) => dep !== 'echarts' && !dep.startsWith('echarts/'),
      );
      return config;
    },
  },
];
