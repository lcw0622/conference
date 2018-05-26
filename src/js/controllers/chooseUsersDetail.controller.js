(function() {
    'use strict';

    angular
        .module('app')
        .controller('chooseUsersDetailController', chooseUsersDetailController);

    chooseUsersDetailController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$ionicLoading', 'publicService', '$ionicHistory'];

    function chooseUsersDetailController($scope, $state, $stateParams, $rootScope, $ionicLoading, publicService, $ionicHistory) {
        var vm = this;
        vm.goBack = goBack;
        vm.init = init;
        vm.chooseUsersDetail = chooseUsersDetail;
        vm.saveBtnClick = saveBtnClick;
        // vm.getDetail = getDetail;
        vm.dTitle = '选择人员';
        vm.memberNames = '';
        vm.memberIds = '';
        vm.memberLoginNames = '';
        vm.noticeSelect = '2';
        vm.isDetail = false; //判断false是选择页面 ,true是展示详情的页面
        vm.isActive = false;
        vm.init();

        function init() {


        }
        localStorage.setItem('names','');
        function chooseUsersDetail(item) {
            var person = {
                a: '欧阳峰',
                b: '小明',
                c: '小红',
                d: '小新',
                e: 'dave',
                f: '小二'
            };
            vm[item]=!vm[item];

            var all_user = localStorage.getItem('names');
            var name
            if (all_user.indexOf(person[item]) != '-1') {
                name = all_user.replace(' '+person[item], '');
            }else {
                name = all_user + ' ' + person[item];
            }
            localStorage.setItem('names', name);
            return false;

            var list = [], i;
            ns.runtime.contact({
                'onSuccess': function(msg) {
                    list = msg.obj;
                    vm.memberNames = '';
                    vm.memberIds = '';
                    vm.memberLoginNames = '';
                    for (i = 0; i < list.length; i += 1) {
                        if (( i + 1 ) == list.length) {
                            vm.memberNames += list[i]['user'].realName;
                            vm.memberLoginNames += list[i]['user'].userName;
                            vm.memberIds += list[i]['userAgencyJobs'][0]['userId'];
                        } else {
                            vm.memberNames += list[i]['user'].realName + ',';
                            vm.memberLoginNames += list[i]['user'].userName + ',';
                            vm.memberIds += list[i]['userAgencyJobs'][0]['userId'] + ',';
                        }
                    }
                    //处理返回后无法自动刷新立刻显示的问题
                    setTimeout(function () {
                        $scope.$apply(function () {
                            vm.memberNames = vm.memberNames;
                        });
                    }, 200);
                },
                'onFail': function(msg) {
                    $ionicLoading.show({
                        template: '<span class="tips">人员选择打开失败</span>',
                        noBackdrop: true,
                        duration: 2000
                    });
                }
            });
        }
        function saveBtnClick() {
            if (vm.meetingTitle == undefined || vm.meetingTitle == '') {
                // 模态框
                $ionicLoading.show({
                    template: '<span class="tips">请输入会议议题</span>',
                    noBackdrop: true,
                    duration: 2000
                });
                return;
            }








        }

        /*
         * 返回
         * flag 1表示预订时间跳转到这个页面，2表示壳子端消息，3表示从我的预订点击过来查看详情
         */
        function goBack() {
            $ionicHistory.goBack();
        }
    }
})();
