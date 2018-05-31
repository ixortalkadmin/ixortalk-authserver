/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-present IxorTalk CVBA
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

describe('Controller Tests', function() {

    beforeEach(mockApiAccountCall);
    beforeEach(mockI18nCalls);

    describe('RegisterController', function() {

        var $scope, $q; // actual implementations
        var MockTimeout, MockTranslate, MockAuth; // mocks
        var createController; // local utility function

        beforeEach(inject(function($injector) {
            $q = $injector.get('$q');
            $scope = $injector.get('$rootScope').$new();
            MockTimeout = jasmine.createSpy('MockTimeout');
            MockAuth = jasmine.createSpyObj('MockAuth', ['createAccount']);
            MockTranslate = jasmine.createSpyObj('MockTranslate', ['use']);

            var locals = {
                'Auth': MockAuth,
                '$translate': MockTranslate,
                '$timeout': MockTimeout,
                '$scope': $scope,
            };
            createController = function() {
                $injector.get('$controller')('RegisterController as vm', locals);
            };
        }));

        it('should ensure the two passwords entered match', function() {
            // given
            createController();
            $scope.vm.registerAccount.password = 'password';
            $scope.vm.confirmPassword = 'non-matching';
            // when
            $scope.vm.register();
            // then
            expect($scope.vm.doNotMatch).toEqual('ERROR');
        });

        it('should update success to OK after creating an account', function() {
            // given
            MockTranslate.use.and.returnValue('en');
            MockAuth.createAccount.and.returnValue($q.resolve());
            createController();
            $scope.vm.registerAccount.password = $scope.vm.confirmPassword = 'password';
            // when
            $scope.$apply($scope.vm.register); // $q promises require an $apply
            // then
            expect(MockAuth.createAccount).toHaveBeenCalledWith({
                password: 'password',
                langKey: 'en'
            });
            expect($scope.vm.success).toEqual('OK');
            expect($scope.vm.registerAccount.langKey).toEqual('en');
            expect(MockTranslate.use).toHaveBeenCalled();
            expect($scope.vm.errorUserExists).toBeNull();
            expect($scope.vm.errorEmailExists).toBeNull();
            expect($scope.vm.error).toBeNull();
        });

        it('should notify of user existence upon 400/login already in use', function() {
            // given
            MockAuth.createAccount.and.returnValue($q.reject({
                status: 400,
                data: 'login already in use'
            }));
            createController();
            $scope.vm.registerAccount.password = $scope.vm.confirmPassword = 'password';
            // when
            $scope.$apply($scope.vm.register); // $q promises require an $apply
            // then
            expect($scope.vm.errorUserExists).toEqual('ERROR');
            expect($scope.vm.errorEmailExists).toBeNull();
            expect($scope.vm.error).toBeNull();
        });

        it('should notify of email existence upon 400/e-mail address already in use', function() {
            // given
            MockAuth.createAccount.and.returnValue($q.reject({
                status: 400,
                data: 'e-mail address already in use'
            }));
            createController();
            $scope.vm.registerAccount.password = $scope.vm.confirmPassword = 'password';
            // when
            $scope.$apply($scope.vm.register); // $q promises require an $apply
            // then
            expect($scope.vm.errorEmailExists).toEqual('ERROR');
            expect($scope.vm.errorUserExists).toBeNull();
            expect($scope.vm.error).toBeNull();
        });

        it('should notify of generic error', function() {
            // given
            MockAuth.createAccount.and.returnValue($q.reject({
                status: 503
            }));
            createController();
            $scope.vm.registerAccount.password = $scope.vm.confirmPassword = 'password';
            // when
            $scope.$apply($scope.vm.register); // $q promises require an $apply
            // then
            expect($scope.vm.errorUserExists).toBeNull();
            expect($scope.vm.errorEmailExists).toBeNull();
            expect($scope.vm.error).toEqual('ERROR');
        });

    });
});
