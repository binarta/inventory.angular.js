module.exports = function(config) {
    config.set({
        basePath:'.',
        frameworks:['jasmine'],
        files:[
            {pattern:'bower_components/angular/angular.js'},
            {pattern:'bower_components/angular-mocks/angular-mocks.js'},
            {pattern:'bower_components/binarta.usecase.adapter.angular/src/angular.usecase.adapter.js'},
            {pattern:'bower_components/thk-rest-client-mock/src/rest.client.mock.js'},
            {pattern:'bower_components/thk-config-mock/src/config.mock.js'},
            {pattern:'bower_components/thk-notifications-mock/src/notifications.mock.js'},
            {pattern:'bower_components/binarta.i18n.mock.angular/src/i18n.mock.js'},
            {pattern:'src/**/*.js'},
            {pattern:'test/**/*.js'}
        ],
        browsers:['PhantomJS']
    });
};