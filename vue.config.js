module.exports = {
  lintOnSave: false,
  pwa: {
    name: 'PsyTrance',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: './service-worker.js',
      swDest: 'service-worker.js'
      // ...other Workbox options...
    }
  }
}
