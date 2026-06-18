export default {
  default: {
    paths: ['docs/specs/features/**/*.feature'],
    import: ['tests/bdd/**/*.mjs'],
    tags: '@api and not @wip',
    format: ['progress', 'html:reports/cucumber.html'],
    publishQuiet: true
  }
}
