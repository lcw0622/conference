(function() {
    'use strict';

    angular
        .module('app')
        .controller('DetailController', DetailController);

    DetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$ionicLoading', '$sce', '$ionicModal', '$timeout', '$state', 'publicService'];

    function DetailController($scope, $rootScope, $stateParams, $ionicLoading, $sce, $ionicModal, $timeout, $state, publicService) {
        var vm = this;

        vm.init = init; // 初始化
        vm.getDatas = getDatas; // 加载数据
        vm.goBack = goBack; // 返回
        $rootScope.backStatus = 'detail';

        // 初始化
        vm.init();

        /*
         * 初始化函数
         * Author：dyp
         * Date:2017-9-26
         */
        function init() {
            // 调用获取数据
            vm.getDatas();
        }
        /*
         * 返回页面
         * Author:dyp
         * Date:2017-9-26
         */
        function goBack() {
            $state.go('list', {});
        }
        /*
         * 获取数据
         * Author：dyp
         * Date:2017-9-26
         */
        function getDatas() {
            var params = {
                'ssoTicket.s': $rootScope.sso,
                'id.s': $stateParams.roomId
            };
            publicService.sendRequest('getRoomById', params, function(msg) {
                vm.isActive = false;
                if (msg[0].h[0]['code.i'] == 0) {
                    vm.details = msg[1].b[0].room[0];
                    vm.carousels = $sce.trustAsResourceUrl(vm.details['coverImg.s']);
                }
            });
        }
    }
})();
