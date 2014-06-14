describe('inventory', function () {
    var $scope, ctrl, rest, payload, dispatcher;

    beforeEach(module('inventory'));
    beforeEach(module('notifications'));
    beforeEach(inject(function ($rootScope, restServiceHandler, config, topicMessageDispatcherMock) {
        $scope = $rootScope.$new();
        rest = restServiceHandler;
        config.baseUri = 'http://host/';
        dispatcher = topicMessageDispatcherMock;
    }));

    function request() {
        return rest.calls[0].args[0];
    }

    describe('SubscribeForQuantityIncrementNotificationsController', function () {
        beforeEach(inject(function ($controller) {
            ctrl = $controller(SubscribeForQuantityIncrementNotificationsController, {$scope: $scope});
            payload = {
                id: 'item-id',
                type: 'notification-transport-type'
            };
        }));

        describe('on submit', function () {
            beforeEach(function () {
                $scope.init({
                    payload: payload
                });
                $scope.submit();
            });

            it('send subscription request', function () {
                expect(request().params.method).toEqual('PUT');
                expect(request().params.url).toEqual('http://host/api/quantity/increment/notification/subscriptions');
                expect(request().params.data).toEqual(payload);
                expect(request().params.headers['Accept-Language']).toEqual('en');
                expect(request().params.withCredentials).toBeTruthy();
            });

            it('on success send notification', function () {
                request().success();

                expect(dispatcher['system.success']).toEqual({
                    msg: 'subscribe.quantity.increment.success.notification',
                    default: 'You will receive an e-mail when this item is available again.'
                });
            });
        });
    });

    describe('InventoryController', function () {
        var item;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller(InventoryController, {
                $scope: scope
            });
            item = {
                id: 'item-id',
                quantity: 1
            };
        }));

        describe('on make negative', function () {
            beforeEach(function () {
                scope.negativeQuantity(item);
            });

            it('quantity should be a negative value', function () {
                expect(item.quantity).toEqual(-1);
            });
        });

        describe('on make positive', function () {
            beforeEach(function () {
                item.quantity = -1;
                scope.positiveQuantity(item);
            });

            it('quantity should be a negative value', function () {
                expect(item.quantity).toEqual(1);
            });
        });

        it('on reset quantity', function () {
            scope.resetQuantity(item);

            expect(item.quantity).toEqual(1);
        });
    });

    describe('IsItemInStock', function () {
        var success, error;
        beforeEach(inject(function (isItemInStock) {
            isItemInStock(scope, {id: 'I', quantity: 1}, function () {
                success = true;
            }, function () {
                error = true;
            });
        }));

        it('request gets sent', inject(function () {
            expect(request().params).toEqual({
                method: 'POST',
                url: 'http://host/inventory/in-stock',
                data: {
                    id: 'I',
                    quantity: 1
                }
            })
        }));

        describe('on success', function () {
            beforeEach(function () {
                request().success();
            });

            it('callback is fired', inject(function () {
                expect(success).toBeTruthy();
            }));
        });

        describe('on error', function () {
            beforeEach(function () {
                request().error();
            });

            it('callback is fired', inject(function () {
                expect(error).toBeTruthy();
            }));
        });
    });
});