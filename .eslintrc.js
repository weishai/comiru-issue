module.exports = {
  root: true,

  env: {
    browser: true,
    node: true
  },

  extends: [
    'eslint:recommended',
    'plugin:es5/no-es2015',
    'plugin:prettier/recommended'
  ],

  plugins: ['es5'],

  rules: {
    'prettier/prettier': 'error'
  }
}
