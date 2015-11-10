var grunt = require('grunt');
require('load-grunt-tasks')(grunt);
var files = ['lib/**/*.js', 'app.js', 'test/**/*.js'];

grunt.initConfig({
    mochacli: {
        options: {
            timeout: 2000,
            reporter: 'spec',
            bail: true
        },
        all: ['test/*.js']
    },
    jshint: {
        files: files,
        options: {
            jshintrc: './.jshintrc'
        }
    },
    jscs: {
        files: {
            src: files
        },
        options: {
            config: '.jscsrc',
            esnext: true
        }
    },
    jsbeautifier: {
        test: {
            files: {
                src: files
            },
            options: {
                mode: 'VERIFY_ONLY',
                config: '.beautifyrc'
            }
        },
        write: {
            files: {
                src: files
            },
            options: {
                config: '.beautifyrc'
            }
        }
    },
    watch: {
        scripts: {
            files: files,
            tasks: ['test'],
            options: {
                spawn: false,
            },
        },
    }
});
grunt.registerTask('test', ['jshint', 'jscs', 'mochacli:all']);
grunt.registerTask('unitTest', ['mochacli:all']);
