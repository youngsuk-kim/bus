// vite.config.js
export default {
  // other vite config options...
  server: {
    fs: {
      strict: false
    },
    // for SPAs
    // https://vitejs.dev/config/#server-fallback
    fallback: 'index.html'
  }
}
