angular.module('inventory', ['rest.client', 'angular.usecase.adapter', 'config', 'i18n'])
    .controller('SubscribeForQuantityIncrementNotificationsController', ['$scope', 'config', 'localeResolver', 'usecaseAdapterFactory', 'restServiceHandler', SubscribeForQuantityIncrementNotificationsController])
    .controller('InventoryController', ['$scope', InventoryController]);

function SubscribeForQuantityIncrementNotificationsController($scope, config, localeResolver, usecaseAdapterFactory, restServiceHandler) {
    var self = this;

    $scope.init = function(it) {
        self.args = it;
    };
    $scope.submit = function() {
        var ctx = usecaseAdapterFactory($scope);
        ctx.params = {
            method:'PUT',
            url:config.baseUri + 'api/quantity/increment/notification/subscriptions',
            data:self.args.payload,
            withCredentials:true,
            headers:{
                'Accept-Language':localeResolver()
            }
        };
        restServiceHandler(ctx);
    };
}

function InventoryController($scope) {
    $scope.negativeQuantity = function (item) {
        item.quantity = -Math.abs(item.quantity);
    };

    $scope.positiveQuantity = function (item) {
        item.quantity = Math.abs(item.quantity);
    };

    $scope.resetQuantity = function (item) {
        item.quantity = 1;
    };
}