/*
 * jQuery File Upload Plugin Angular JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global window, angular */

(function () {
    'use strict';
    var testurlI = /(Image.html)$/;
    var testurlV = /(Video.html)$/;
    var testurlM = /(Music.html)$/;
    var isOnGitHub = window.location.hostname === 'blueimp.github.io',
        url = 'server/php/';
    angular.module('demo', [
        'blueimp.fileupload'
    ])
        .config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s',
                    console.log(window.location.href)
                );
                if (testurlI.test(window.location.href)) {
                    // Demo settings:
                    console.log('I');
                    angular.extend(fileUploadProvider.defaults, {
                        // Enable image resizing, except for Android and Opera,
                        // which actually support image resizing, but fail to
                        // send Blob objects via XHR requests:
                        disableImageResize: /Android(?!.*Chrome)|Opera/
                            .test(window.navigator.userAgent),
                        maxFileSize: 102400,
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                    });
                }
                else if(testurlV.test(window.location.href)){
                    console.log('V');
                    angular.extend(fileUploadProvider.defaults, {
                        disableImageResize: /Android(?!.*Chrome)|Opera/i
                            .test(window.navigator.userAgent),
                        maxFileSize: 1073741824,
                        acceptFileTypes: /(\.|\/)(avi|mpg|mpeg|mov|rm|ram|swf|mp4|mkv|rmvb|iso)$/i
                    });
                }
                else if(testurlM.test(window.location.href)){
                    console.log('M');
                    angular.extend(fileUploadProvider.defaults, {
                        disableImageResize: /Android(?!.*Chrome)|Opera/
                            .test(window.navigator.userAgent),
                        maxFileSize: 10485760,
                        acceptFileTypes: /(\.|\/)(mp3|cue|wav|wma|ape|acc)$/i
                    });
                }
            }
        ])

        .controller('DemoFileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http) {
                $scope.options = {
                    url: url
                };
                if (!isOnGitHub) {
                    $scope.loadingFiles = true;
                    $http.get(url)
                        .then(
                            function (response) {
                                $scope.loadingFiles = false;
                                $scope.queue = response.data.files || [];
                                var testurlI = /(Image.html)$/;
                                var testurlV = /(Video.html)$/;
                                var testurlM = /(Music.html)$/;
                                if (testurlI.test(window.location.href)) {
                                    var re = /(\.|\/)(gif|jpe?g|png)$/;
                                    for (var i = 0; i < $scope.queue.length; i++) {
                                        console.log($scope.queue[i]);
                                        if (!re.test($scope.queue[i].name)) {
                                            $scope.queue.splice(i, 1);
                                        }
                                        console.log($scope.queue[i]);
                                    }
                                }
                                else if (testurlV.test(window.location.href)) {
                                    var re = /(\.|\/)(avi|mpg|mpeg|mov|rm|ram|swf|mp4|mkv|rmvb|iso)$/;
                                    for (var i = 0; i < $scope.queue.length; i++) {
                                        console.log($scope.queue[i]);
                                        if (!re.test($scope.queue[i].name)) {
                                            $scope.queue.splice(i, 1);
                                        }
                                        console.log($scope.queue[i]);
                                    }
                                }
                                else if (testurlM.test(window.location.href)) {
                                    var re = /(\.|\/)(mp3|cue|wav|wma|ape|acc)$/;
                                    for (var i = 0; i < $scope.queue.length; i++) {
                                        console.log($scope.queue[i]);
                                        if (!re.test($scope.queue[i].name)) {
                                            $scope.queue.splice(i, 1);
                                        }
                                        console.log($scope.queue[i]);
                                    }
                                }
                            },
                            function () {
                                $scope.loadingFiles = false;
                            }
                        );
                }
            }
        ])

        .controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);

}());
