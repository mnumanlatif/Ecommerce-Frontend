module.exports = {
  input: [
    'src/**/*.{js,jsx}', // files to scan
  ],
  output: './src/locales', // output translation files here

  options: {
    debug: true,
    removeUnusedKeys: true,
    sort: true,
    func: {
      list: ['t', 'i18n.t'],
      extensions: ['.js', '.jsx'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      extensions: ['.js', '.jsx'],
    },
    lngs: ['en', 'ur', 'es'],
    defaultLng: 'en',
    defaultNs: 'translation',
    resource: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
      savePath: 'src/locales/{{lng}}/{{ns}}.json',
    },
    keySeparator: false, // if keys contain dot (.)
    nsSeparator: false,
  },
};
