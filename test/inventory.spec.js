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

        describe('initialized', function() {
            beforeEach(function () {
                $scope.init({
                    payload: payload
                });
            });

            describe('on submit', function () {
                beforeEach(function () {
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

            it('on submit with on success handler', function() {
                var executed = false;
                $scope.submit({success:function() {executed = true}});
                request().success();
                expect(executed).toEqual(true);
            })
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
                url: 'http://host/api/inventory/in-stock',
                data: {
                    reportType: 'complex',
                    id:'I',
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

    describe('InStockController', function() {
        beforeEach(inject(function($controller) {
            ctrl = $controller(InStockController, {$scope:scope});
            scope.init({});
        }));

        describe('on success', function() {
            beforeEach(function() {
                request().success({stock:5});
            });

            it('stock gets exposed', inject(function() {
                expect(scope.stock).toEqual(5);
            }));
        });

        describe('on rejected', function() {
            function rejectWith(args) {
                request().reset();
                request().rejected(args);
                request().error();
            }
            beforeEach(function() {
                rejectWith({quantity:[{label:'upperbound', params:{boundary:5}}]});
            });

            it('violation param boundary is exposed as stock', inject(function() {
                expect(scope.stock).toEqual(5);
            }));
        });
    });
});