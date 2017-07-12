module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-tag');

  grunt.initConfig({
    release: {
      options: {
        npm: false,
        afterRelease: ['tag'],
        github: {
          repo: 'AirVantage/node-tech-mail',
          accessTokenVar: 'GITHUB_ACCESS_TOKEN'
        }
      }
    },
    tag: { options: { tagName: '<%= version.match(/\\d*/) %>.x' } }
  });
};
