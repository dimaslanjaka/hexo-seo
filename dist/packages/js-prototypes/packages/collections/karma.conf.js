"use strict";
// Karma configuration
// Generated on Tue Mar 07 2017 13:59:10 GMT-0800 (PST)
module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '.',
        //browserNoActivityTimeout: 20000,
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],
        // list of files / patterns to load in the browser
        files: [
            'test/run-karma.js',
            {
                pattern: 'package.json',
                included: false
            },
            {
                pattern: '*.js',
                included: false
            },
            {
                pattern: 'listen/*.js',
                included: false
            },
            {
                pattern: 'test/**/*.js',
                included: false
            },
            {
                pattern: 'test/**/*.json',
                included: false
            },
            {
                pattern: 'test/**/*.html',
                included: false
            },
            {
                pattern: 'node_modules/**/*.json',
                included: false
            },
            {
                pattern: 'node_modules/**/*.css',
                included: false
            },
            {
                pattern: 'node_modules/**/*.js',
                included: false
            }
        ],
        // list of files to exclude
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        // '*.js': 'coverage'
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['coverage', 'progress'],
        coverageReporter: {
            type: 'html',
            dir: 'report/coverage/'
        },
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],
        browsers: ['phantomjsLauncher'],
        // you can define custom flags
        customLaunchers: {
            phantomjsLauncher: {
                // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
                exitOnResourceError: true,
                base: 'PhantomJS',
                options: {
                    settings: {
                        webSecurityEnabled: false,
                        ignoreSSLErrors: true
                    }
                },
                flags: [
                    '--ssl-protocol=tlsv1',
                    '--load-images=no',
                    '--ignore-ssl-errors=yes'
                ]
            },
            PhantomJS_debug: {
                base: 'PhantomJS',
                debug: true,
                options: {
                    settings: {
                        webSecurityEnabled: false,
                        ignoreSSLErrors: true
                    }
                },
                flags: [
                    '--web-security=false',
                    '--ssl-protocol=tlsv1',
                    '--load-images=no',
                    '--ignore-ssl-errors=yes',
                    '--ssl-client-certificate-file=./development/origin-server/rest-accelerator.example.com.crt',
                    '--ssl-client-key-file=./development/origin-server/rest-accelerator.example.com.key'
                ]
            },
            firefoxLauncher: {
                base: 'Firefox',
                prefs: {
                    'security.ssl.enable_ocsp_stapling': false
                }
            },
            Chrome_without_security: {
                base: 'Chrome',
                flags: [
                    '--ignore-certificate-errors=true',
                    '--user-data-dir=./tmp',
                    '--allow-insecure-localhost',
                    '--allow-running-insecure-content'
                ]
            }
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher'
        ]
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FybWEuY29uZi5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy9rYXJtYS5jb25mLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQkFBc0I7QUFDdEIsdURBQXVEO0FBRXZELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxNQUFNO0lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFFVCw0REFBNEQ7UUFDNUQsUUFBUSxFQUFFLEdBQUc7UUFFYixrQ0FBa0M7UUFFbEMsb0JBQW9CO1FBQ3BCLHVFQUF1RTtRQUN2RSxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFFdkIsa0RBQWtEO1FBQ2xELEtBQUssRUFBRTtZQUNILG1CQUFtQjtZQUNuQjtnQkFDSSxPQUFPLEVBQUUsY0FBYztnQkFDdkIsUUFBUSxFQUFFLEtBQUs7YUFDbEI7WUFDRDtnQkFDSSxPQUFPLEVBQUUsTUFBTTtnQkFDZixRQUFRLEVBQUUsS0FBSzthQUNsQjtZQUNEO2dCQUNJLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixRQUFRLEVBQUUsS0FBSzthQUNsQjtZQUNEO2dCQUNJLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixRQUFRLEVBQUUsS0FBSzthQUNsQjtZQUNEO2dCQUNJLE9BQU8sRUFBRSxnQkFBZ0I7Z0JBQ3pCLFFBQVEsRUFBRSxLQUFLO2FBQ2xCO1lBQ0Q7Z0JBQ0ksT0FBTyxFQUFFLGdCQUFnQjtnQkFDekIsUUFBUSxFQUFFLEtBQUs7YUFDbEI7WUFDRDtnQkFDSSxPQUFPLEVBQUUsd0JBQXdCO2dCQUNqQyxRQUFRLEVBQUUsS0FBSzthQUNsQjtZQUNEO2dCQUNJLE9BQU8sRUFBRSx1QkFBdUI7Z0JBQ2hDLFFBQVEsRUFBRSxLQUFLO2FBQ2xCO1lBQ0Q7Z0JBQ0ksT0FBTyxFQUFFLHNCQUFzQjtnQkFDL0IsUUFBUSxFQUFFLEtBQUs7YUFDbEI7U0FDSjtRQUVELDJCQUEyQjtRQUMzQixPQUFPLEVBQUUsRUFDUjtRQUVELCtEQUErRDtRQUMvRCwrRUFBK0U7UUFDL0UsYUFBYSxFQUFFO1FBQ1oscUJBQXFCO1NBQ3ZCO1FBRUQsK0JBQStCO1FBQy9CLHNDQUFzQztRQUN0Qyx1RUFBdUU7UUFDdkUsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUVuQyxnQkFBZ0IsRUFBRTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osR0FBRyxFQUFFLGtCQUFrQjtTQUMxQjtRQUVELGtCQUFrQjtRQUNsQixJQUFJLEVBQUUsSUFBSTtRQUVWLDZEQUE2RDtRQUM3RCxNQUFNLEVBQUUsSUFBSTtRQUVaLG1CQUFtQjtRQUNuQixvSEFBb0g7UUFDcEgsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1FBRXpCLCtFQUErRTtRQUMvRSxTQUFTLEVBQUUsSUFBSTtRQUVmLHVCQUF1QjtRQUN2QiwrRUFBK0U7UUFDL0UseURBQXlEO1FBQ3pELHVCQUF1QjtRQUN2QiwrRUFBK0U7UUFDL0UseURBQXlEO1FBQ3pELFFBQVEsRUFBRSxDQUFDLG1CQUFtQixDQUFDO1FBRS9CLDhCQUE4QjtRQUM5QixlQUFlLEVBQUU7WUFDYixpQkFBaUIsRUFBRTtnQkFDZix3R0FBd0c7Z0JBQ3hHLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLElBQUksRUFBRSxXQUFXO2dCQUNqQixPQUFPLEVBQUU7b0JBQ0wsUUFBUSxFQUFFO3dCQUNOLGtCQUFrQixFQUFFLEtBQUs7d0JBQ3pCLGVBQWUsRUFBRSxJQUFJO3FCQUN4QjtpQkFDSjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0gsc0JBQXNCO29CQUN0QixrQkFBa0I7b0JBQ2xCLHlCQUF5QjtpQkFDNUI7YUFDSjtZQUNELGVBQWUsRUFBRTtnQkFDYixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFO29CQUNMLFFBQVEsRUFBRTt3QkFDTixrQkFBa0IsRUFBRSxLQUFLO3dCQUN6QixlQUFlLEVBQUUsSUFBSTtxQkFDeEI7aUJBQ0o7Z0JBQ0QsS0FBSyxFQUFFO29CQUNILHNCQUFzQjtvQkFDdEIsc0JBQXNCO29CQUN0QixrQkFBa0I7b0JBQ2xCLHlCQUF5QjtvQkFDekIsNEZBQTRGO29CQUM1RixvRkFBb0Y7aUJBQ3ZGO2FBQ0o7WUFDRCxlQUFlLEVBQUU7Z0JBQ2IsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsS0FBSyxFQUFFO29CQUNILG1DQUFtQyxFQUFFLEtBQUs7aUJBQzdDO2FBQ0o7WUFDRCx1QkFBdUIsRUFBRTtnQkFDckIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFO29CQUNILGtDQUFrQztvQkFDbEMsdUJBQXVCO29CQUN2Qiw0QkFBNEI7b0JBQzVCLGtDQUFrQztpQkFDckM7YUFDSjtTQUNKO1FBRUQsOEJBQThCO1FBQzlCLDZEQUE2RDtRQUM3RCxTQUFTLEVBQUUsS0FBSztRQUVoQixvQkFBb0I7UUFDcEIsa0RBQWtEO1FBQ2xELFdBQVcsRUFBRSxRQUFRO1FBRXJCLE9BQU8sRUFBRTtZQUNMLGVBQWU7WUFDZixnQkFBZ0I7WUFDaEIsdUJBQXVCO1lBQ3ZCLHdCQUF3QjtZQUN4QiwwQkFBMEI7U0FDN0I7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBLYXJtYSBjb25maWd1cmF0aW9uXG4vLyBHZW5lcmF0ZWQgb24gVHVlIE1hciAwNyAyMDE3IDEzOjU5OjEwIEdNVC0wODAwIChQU1QpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gIGNvbmZpZy5zZXQoe1xuXG4gICAgLy8gYmFzZSBwYXRoLCB0aGF0IHdpbGwgYmUgdXNlZCB0byByZXNvbHZlIGZpbGVzIGFuZCBleGNsdWRlXG4gICAgYmFzZVBhdGg6ICcuJyxcblxuICAgIC8vYnJvd3Nlck5vQWN0aXZpdHlUaW1lb3V0OiAyMDAwMCxcblxuICAgIC8vIGZyYW1ld29ya3MgdG8gdXNlXG4gICAgLy8gYXZhaWxhYmxlIGZyYW1ld29ya3M6IGh0dHBzOi8vbnBtanMub3JnL2Jyb3dzZS9rZXl3b3JkL2thcm1hLWFkYXB0ZXJcbiAgICBmcmFtZXdvcmtzOiBbJ2phc21pbmUnXSxcblxuICAgIC8vIGxpc3Qgb2YgZmlsZXMgLyBwYXR0ZXJucyB0byBsb2FkIGluIHRoZSBicm93c2VyXG4gICAgZmlsZXM6IFtcbiAgICAgICAgJ3Rlc3QvcnVuLWthcm1hLmpzJyxcbiAgICAgICAge1xuICAgICAgICAgICAgcGF0dGVybjogJ3BhY2thZ2UuanNvbicsXG4gICAgICAgICAgICBpbmNsdWRlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGF0dGVybjogJyouanMnLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBhdHRlcm46ICdsaXN0ZW4vKi5qcycsXG4gICAgICAgICAgICBpbmNsdWRlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGF0dGVybjogJ3Rlc3QvKiovKi5qcycsXG4gICAgICAgICAgICBpbmNsdWRlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGF0dGVybjogJ3Rlc3QvKiovKi5qc29uJyxcbiAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAndGVzdC8qKi8qLmh0bWwnLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBhdHRlcm46ICdub2RlX21vZHVsZXMvKiovKi5qc29uJyxcbiAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAnbm9kZV9tb2R1bGVzLyoqLyouY3NzJyxcbiAgICAgICAgICAgIGluY2x1ZGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwYXR0ZXJuOiAnbm9kZV9tb2R1bGVzLyoqLyouanMnLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICBdLFxuXG4gICAgLy8gbGlzdCBvZiBmaWxlcyB0byBleGNsdWRlXG4gICAgZXhjbHVkZTogW1xuICAgIF0sXG5cbiAgICAvLyBwcmVwcm9jZXNzIG1hdGNoaW5nIGZpbGVzIGJlZm9yZSBzZXJ2aW5nIHRoZW0gdG8gdGhlIGJyb3dzZXJcbiAgICAvLyBhdmFpbGFibGUgcHJlcHJvY2Vzc29yczogaHR0cHM6Ly9ucG1qcy5vcmcvYnJvd3NlL2tleXdvcmQva2FybWEtcHJlcHJvY2Vzc29yXG4gICAgcHJlcHJvY2Vzc29yczoge1xuICAgICAgIC8vICcqLmpzJzogJ2NvdmVyYWdlJ1xuICAgIH0sXG5cbiAgICAvLyB0ZXN0IHJlc3VsdHMgcmVwb3J0ZXIgdG8gdXNlXG4gICAgLy8gcG9zc2libGUgdmFsdWVzOiAnZG90cycsICdwcm9ncmVzcydcbiAgICAvLyBhdmFpbGFibGUgcmVwb3J0ZXJzOiBodHRwczovL25wbWpzLm9yZy9icm93c2Uva2V5d29yZC9rYXJtYS1yZXBvcnRlclxuICAgIHJlcG9ydGVyczogWydjb3ZlcmFnZScsICdwcm9ncmVzcyddLFxuXG4gICAgY292ZXJhZ2VSZXBvcnRlcjoge1xuICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgIGRpcjogJ3JlcG9ydC9jb3ZlcmFnZS8nXG4gICAgfSxcblxuICAgIC8vIHdlYiBzZXJ2ZXIgcG9ydFxuICAgIHBvcnQ6IDk4NzYsXG5cbiAgICAvLyBlbmFibGUgLyBkaXNhYmxlIGNvbG9ycyBpbiB0aGUgb3V0cHV0IChyZXBvcnRlcnMgYW5kIGxvZ3MpXG4gICAgY29sb3JzOiB0cnVlLFxuXG4gICAgLy8gbGV2ZWwgb2YgbG9nZ2luZ1xuICAgIC8vIHBvc3NpYmxlIHZhbHVlczogY29uZmlnLkxPR19ESVNBQkxFIHx8IGNvbmZpZy5MT0dfRVJST1IgfHwgY29uZmlnLkxPR19XQVJOIHx8IGNvbmZpZy5MT0dfSU5GTyB8fCBjb25maWcuTE9HX0RFQlVHXG4gICAgbG9nTGV2ZWw6IGNvbmZpZy5MT0dfSU5GTyxcblxuICAgIC8vIGVuYWJsZSAvIGRpc2FibGUgd2F0Y2hpbmcgZmlsZSBhbmQgZXhlY3V0aW5nIHRlc3RzIHdoZW5ldmVyIGFueSBmaWxlIGNoYW5nZXNcbiAgICBhdXRvV2F0Y2g6IHRydWUsXG5cbiAgICAvLyBzdGFydCB0aGVzZSBicm93c2Vyc1xuICAgIC8vIGF2YWlsYWJsZSBicm93c2VyIGxhdW5jaGVyczogaHR0cHM6Ly9ucG1qcy5vcmcvYnJvd3NlL2tleXdvcmQva2FybWEtbGF1bmNoZXJcbiAgICAvL2Jyb3dzZXJzOiBbJ1BoYW50b21KUycsICdDaHJvbWUnLCAnRmlyZWZveCcsICdTYWZhcmknXSxcbiAgICAvLyBzdGFydCB0aGVzZSBicm93c2Vyc1xuICAgIC8vIGF2YWlsYWJsZSBicm93c2VyIGxhdW5jaGVyczogaHR0cHM6Ly9ucG1qcy5vcmcvYnJvd3NlL2tleXdvcmQva2FybWEtbGF1bmNoZXJcbiAgICAvL2Jyb3dzZXJzOiBbJ1BoYW50b21KUycsICdDaHJvbWUnLCAnRmlyZWZveCcsICdTYWZhcmknXSxcbiAgICBicm93c2VyczogWydwaGFudG9tanNMYXVuY2hlciddLFxuXG4gICAgLy8geW91IGNhbiBkZWZpbmUgY3VzdG9tIGZsYWdzXG4gICAgY3VzdG9tTGF1bmNoZXJzOiB7XG4gICAgICAgIHBoYW50b21qc0xhdW5jaGVyOiB7XG4gICAgICAgICAgICAvLyBIYXZlIHBoYW50b21qcyBleGl0IGlmIGEgUmVzb3VyY2VFcnJvciBpcyBlbmNvdW50ZXJlZCAodXNlZnVsIGlmIGthcm1hIGV4aXRzIHdpdGhvdXQga2lsbGluZyBwaGFudG9tKVxuICAgICAgICAgICAgZXhpdE9uUmVzb3VyY2VFcnJvcjogdHJ1ZSxcbiAgICAgICAgICAgIGJhc2U6ICdQaGFudG9tSlMnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHdlYlNlY3VyaXR5RW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZVNTTEVycm9yczogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmbGFnczogW1xuICAgICAgICAgICAgICAgICctLXNzbC1wcm90b2NvbD10bHN2MScsXG4gICAgICAgICAgICAgICAgJy0tbG9hZC1pbWFnZXM9bm8nLFxuICAgICAgICAgICAgICAgICctLWlnbm9yZS1zc2wtZXJyb3JzPXllcydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgUGhhbnRvbUpTX2RlYnVnOiB7XG4gICAgICAgICAgICBiYXNlOiAnUGhhbnRvbUpTJyxcbiAgICAgICAgICAgIGRlYnVnOiB0cnVlLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHdlYlNlY3VyaXR5RW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZVNTTEVycm9yczogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmbGFnczogW1xuICAgICAgICAgICAgICAgICctLXdlYi1zZWN1cml0eT1mYWxzZScsXG4gICAgICAgICAgICAgICAgJy0tc3NsLXByb3RvY29sPXRsc3YxJyxcbiAgICAgICAgICAgICAgICAnLS1sb2FkLWltYWdlcz1ubycsXG4gICAgICAgICAgICAgICAgJy0taWdub3JlLXNzbC1lcnJvcnM9eWVzJyxcbiAgICAgICAgICAgICAgICAnLS1zc2wtY2xpZW50LWNlcnRpZmljYXRlLWZpbGU9Li9kZXZlbG9wbWVudC9vcmlnaW4tc2VydmVyL3Jlc3QtYWNjZWxlcmF0b3IuZXhhbXBsZS5jb20uY3J0JyxcbiAgICAgICAgICAgICAgICAnLS1zc2wtY2xpZW50LWtleS1maWxlPS4vZGV2ZWxvcG1lbnQvb3JpZ2luLXNlcnZlci9yZXN0LWFjY2VsZXJhdG9yLmV4YW1wbGUuY29tLmtleSdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgZmlyZWZveExhdW5jaGVyOiB7XG4gICAgICAgICAgICBiYXNlOiAnRmlyZWZveCcsXG4gICAgICAgICAgICBwcmVmczoge1xuICAgICAgICAgICAgICAgICdzZWN1cml0eS5zc2wuZW5hYmxlX29jc3Bfc3RhcGxpbmcnOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDaHJvbWVfd2l0aG91dF9zZWN1cml0eToge1xuICAgICAgICAgICAgYmFzZTogJ0Nocm9tZScsXG4gICAgICAgICAgICBmbGFnczogW1xuICAgICAgICAgICAgICAgICctLWlnbm9yZS1jZXJ0aWZpY2F0ZS1lcnJvcnM9dHJ1ZScsXG4gICAgICAgICAgICAgICAgJy0tdXNlci1kYXRhLWRpcj0uL3RtcCcsXG4gICAgICAgICAgICAgICAgJy0tYWxsb3ctaW5zZWN1cmUtbG9jYWxob3N0JyxcbiAgICAgICAgICAgICAgICAnLS1hbGxvdy1ydW5uaW5nLWluc2VjdXJlLWNvbnRlbnQnXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQ29udGludW91cyBJbnRlZ3JhdGlvbiBtb2RlXG4gICAgLy8gaWYgdHJ1ZSwgS2FybWEgY2FwdHVyZXMgYnJvd3NlcnMsIHJ1bnMgdGhlIHRlc3RzIGFuZCBleGl0c1xuICAgIHNpbmdsZVJ1bjogZmFsc2UsXG5cbiAgICAvLyBDb25jdXJyZW5jeSBsZXZlbFxuICAgIC8vIGhvdyBtYW55IGJyb3dzZXIgc2hvdWxkIGJlIHN0YXJ0ZWQgc2ltdWx0YW5lb3VzXG4gICAgY29uY3VycmVuY3k6IEluZmluaXR5LFxuXG4gICAgcGx1Z2luczogW1xuICAgICAgICAna2FybWEtamFzbWluZScsXG4gICAgICAgICdrYXJtYS1jb3ZlcmFnZScsXG4gICAgICAgICdrYXJtYS1jaHJvbWUtbGF1bmNoZXInLFxuICAgICAgICAna2FybWEtZmlyZWZveC1sYXVuY2hlcicsXG4gICAgICAgICdrYXJtYS1waGFudG9tanMtbGF1bmNoZXInXG4gICAgXVxuICB9KVxufVxuIl19