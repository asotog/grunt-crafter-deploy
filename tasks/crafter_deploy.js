/*
 * grunt-crafter-deploy
 * https://github.com/asotog/grunt-crafter-deploy
 *
 * Copyright (c) 2014 asotog
 * Licensed under the MIT license.
 */

'use strict';

var http = require('http');
var FormData = require('form-data');
var fs = require('fs');

module.exports = function (grunt) {


    grunt.registerMultiTask('crafter_deploy', 'Crafter Studio deployer for assets such as images, js or css', function () {
        /* **************************** */
        /* GLOBALS */
        /* **************************** */
        var self = this;

        var alfrescoTicket = '';

        var filesNumber = 0; /* number of files to be uploaded */
        var filesUploaded = 0 /* files uploaded */
        
        var baseUrl = '';
        // Merge task-specific and/or target-specific options with these defaults.
        var taskOptions = this.options({
            protocol: 'http',
            host: '',
            port: null,
            site: '',
            username: '',
            password: '',
            loginPath: '/alfresco/service/api/login', /* login service path */
            uploadFilePath: '/alfresco/s/cstudio/wcm/content/upload-content-asset' /* upload service path */
        });

        /* **************************** */
        /* METHODS */
        /* **************************** */

        /* executes a GET request */
        var execGetRequest = function (options, responseCallback) {
            var callback = function (response) {
                var str = '';

                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    responseCallback(str);
                });
            }

            http.request(options, callback).end();
        };

        /* uploads a file to the server */
        var uploadFile = function (source, destination) {
            var form = new FormData();
            form.append('site', taskOptions.site);
            form.append('path', destination);
            form.append('file', fs.createReadStream(source));

            form.submit({
                host: taskOptions.host,
                port: taskOptions.port,
                path: taskOptions.uploadFilePath + '?alf_ticket=' + alfrescoTicket,
                auth: taskOptions.username + ':' + taskOptions.password 
            }, function (err, res) {
                filesUploaded += 1;
                grunt.log.writeln('File deployed -> ' + source);
                res.resume();
                /* if all files were uploaded */
                if (filesUploaded == filesNumber) {
                    done();
                }
            });

        };

        /* Reads files that are going to be deployed */
        var processFiles = function () {
            filesNumber = 0;
            filesUploaded = 0;
            
            self.files.forEach(function (f) {
                var dest = f.dest;
                var src = f.src.filter(function (filepath) {
                    if (!grunt.file.exists(filepath)) {
                        //grunt.log.writeln('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                });
                
                filesNumber += src.length;
                
                for (var i = 0; i < src.length; i++) {
                    grunt.log.writeln('Uploading: "' + src[i] + '" to "' + baseUrl + dest + '"');
                    uploadFile(src[i], dest);
                }
            });

        }

        /* **************************** */
        /* BODY */
        /* **************************** */

        if (taskOptions.host != '') {
            baseUrl = taskOptions.protocol + '://' + taskOptions.host + (taskOptions.port ? (':' + taskOptions.port) : '');
            grunt.log.writeln('== Connecting to "' + baseUrl + '", Site = "' + taskOptions.site + '"');
            grunt.log.writeln('== Using credentials: user=' + taskOptions.username + ', password=****');
                              

            var done = this.async();

            var options = {
                host: taskOptions.host,
                port: taskOptions.port,
                path: taskOptions.loginPath + '?u=' + taskOptions.username + '&pw=' + taskOptions.password
            };
            
            /* exec request to retrieve ticket */
            execGetRequest(options, function (response) {
                alfrescoTicket = response.match(/<ticket[^>]*>(.*?)<\/ticket>/)[1];
                processFiles();
            });


        } else {
            grunt.log.writeln('Host not specified, please set it from options');
        }


    });

};