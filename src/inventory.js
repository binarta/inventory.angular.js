angular.module('inventory', ['rest.client', 'angular.usecase.adapter', 'config', 'i18n'])
    .controller('SubscribeForQuantityIncrementNotificationsController', ['$scope', 'config', 'localeResolver', 'usecaseAdapterFactory', 'restServiceHandler', 'topicMessageDispatcher', SubscribeForQuantityIncrementNotificationsController])
    .controller('InventoryController', ['$scope', InventoryController])
    .controller('InStockController', ['$scope', 'isItemInStock', InStockController])
    .factory('isItemInStock', ['usecaseAdapterFactory', 'restServiceHandler', 'config', IsItemInStockFactory]);

function SubscribeForQuantityIncrementNotificationsController($scope, config, localeResolver, usecaseAdapterFactory, restServiceHandler, topicMessageDispatcher) {
    var self = this;

    $scope.init = function(it) {
        self.args = it;
    };
    $scope.submit = function(args) {
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
        ctx.success = function () {
            if(args && args.success) args.success();
            topicMessageDispatcher.fire('system.success', {
                msg: 'subscribe.quantity.increment.success.notification',
                default: 'You will receive an e-mail when this item is available again.'
            });
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

function IsItemInStockFactory(usecaseAdapterFactory, restServiceHandler, config) {
    return function(scope, args, success, error) {
        var request = usecaseAdapterFactory(scope, success, null, 'complex');
        request.params = {
            method:'POST',
            url:config.baseUri + 'api/inventory/in-stock',
            data: {
                reportType: 'complex',
                id:args.id,
                quantity:args.quantity
            }
        };
        request.error = error;
        restServiceHandler(request);
    }
}

function InStockController($scope, isItemInStock) {
    $scope.init = function(args) {
        var success = function(payload) {
            $scope.stock = payload.stock;
        };
        var error = function() {
            $scope.stock = $scope.violationParams.quantity.upperbound.boundary;

        };
        isItemInStock($scope, args, success, error);
    }
}