describe('inventory', function() {
    var $scope, ctrl, rest, payload;

    beforeEach(module('inventory'));
    beforeEach(inject(function($rootScope, restServiceHandler, config) {
        $scope = $rootScope.$new();
        rest = restServiceHandler;
        config.baseUri = 'http://host/'
    }));

    function request() {
        return rest.calls[0].args[0];
    }

    describe('SubscribeForQuantityIncrementNotificationsController', function() {
        beforeEach(inject(function($controller) {
            ctrl = $controller(SubscribeForQuantityIncrementNotificationsController, {$scope:$scope});
            payload = {
                id:'item-id',
                type:'notification-transport-type'
            };
        }));

        it('on submit send subscription request', function() {
            $scope.init({
                payload:payload
            });
            $scope.submit();
            expect(request().params.method).toEqual('PUT');
            expect(request().params.url).toEqual('http://host/api/quantity/increment/notification/subscriptions');
            expect(request().params.data).toEqual(payload);
            expect(request().params.headers['Accept-Language']).toEqual('en');
            expect(request().params.withCredentials).toBeTruthy();
        });
    });
});