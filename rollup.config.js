import createDefaultConfig from '@open-wc/building-rollup/modern-config';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const config = createDefaultConfig({input: './index.html'});

export default {
    ...config,
    output: {
      ...config.output,
      sourcemap: true,
    },
    plugins: [
      ...config.plugins,
    ],
  };