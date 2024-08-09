module.exports = {
  extends: '../.eslintrc.yml',
  ignorePatterns: ['/.eslintrc.js', '/babel.config.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  }
}