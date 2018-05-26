(function() {
    'use strict';

    angular
        .module('app')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope', '$rootScope', 'ionicDatePicker', '$filter', 'getSSOticket', 'publicService' , '$ionicLoading', '$sce', '$timeout', '$ionicPopup', '$state'];

    function ListController($scope, $rootScope, ionicDatePicker, $filter, getSSOticket,  publicService , $ionicLoading, $sce, $timeout,$ionicPopup, $state) {
        var vm = this;
        vm.bookingButton = bookingButton;
        var date = new Date();
        vm.maxDate = new Date(date.setDate(date.getDate() + 90));
        vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.isDisabled = false;
        vm.changeDate = changeDate;
        vm.formatSrc = formatSrc;
        vm.closePage = closePage;
        vm.init = init;
        vm.getRoomList = getRoomList;
        vm.pushRefresh = pushRefresh;
        vm.nextPage = nextPage;
        vm.init();
        $rootScope.backStatus = 'close';

        function init() {
            vm.startRows = 0;
            vm.pageSize = 5;
            vm.rowsCount = 1; // 滚动加载次数
            vm.listData = '';
            vm.listItem = '';
            vm.isActive = true;
            vm.disabled = true; // 滚动加载开关
            vm.changeDate();
            $scope.$on('$ionicView.afterEnter', function(){
                if ($rootScope.sso == undefined || $rootScope.sso == '' ) {
                    getSSOticket.getTicket(function () {
                        vm.getRoomList();
                    });
                } else {
                    vm.getRoomList();
                }
            });
        }
        /*
        * 立即预订按钮
        */
        function bookingButton(id) {
            var showPopup = $ionicPopup.show({
                title: '选择时间', // String. 弹窗的标题。
                template: '请选择你要预订的时间段?', // String (可选)。放在弹窗body内的html模板。
                buttons: [{
                    text: '上午',
                    type: 'button-booking',
                    onTap: function(e) {
                        var sTime = $scope.dateValue + ' 08:00:00';
                        var eTime = $scope.dateValue + ' 12:00:00';
                        //传递到后台 判断该会议室该时间是否被占用
                        var params = {
                            'ssoTicket.s': $rootScope.sso,
                            'roomId.s': id,
                            'startTime.s': sTime,
                            'endTime.s': eTime
                        };
                        publicService.sendRequest('checkTimeSlot', params, function(msg) {
                            if (msg[0].h[0]['code.i'] == 0) {
                                vm.result = msg[1].b[0].result[0]['result.b'];
                                if (vm.result == 0) {
                                    vm.loginName = msg[1].b[0].result[0]['loginName.s'];
                                    // 根据id 查询会议室详情信息
                                    var params = {
                                        'ssoTicket.s': $rootScope.sso,
                                        'id.s': id
                                    };
                                    publicService.sendRequest('getRoomById', params, function(msg) {
                                        vm.isActive = false;
                                        if (msg[0].h[0]['code.i'] == 0) {
                                            vm.details = msg[1].b[0].room[0];
                                            var roomName = vm.details['name.s'];
                                            vm.carousels = $sce.trustAsResourceUrl(vm.details['coverImg.s']);
                                            $state.go('chooseUsers', {sTime: sTime, eTime: eTime, flag : 1,
                                                roomName: roomName,
                                                loginName: vm.loginName,
                                                roomId: id
                                            });
                                        }
                                    });


                                } else {
                                    var showPopup = $ionicPopup.alert({
                                        title: '预订重复', // String. 弹窗的标题。
                                        template: '预订时间内该会议室有预订请重新选择时间!',
                                        okText: '确定'
                                    });
                                }
                            }
                        });
                    }
                },{
                    text: '下午',
                    type: 'button-booking',
                    onTap: function(e) {
                        var sTime = $scope.dateValue + ' 12:00:00';
                        var eTime = $scope.dateValue + ' 18:00:00';
                        //传递到后台 判断该会议室该时间是否被占用
                        var params = {
                            'ssoTicket.s': $rootScope.sso,
                            'roomId.s': id,
                            'startTime.s': sTime,
                            'endTime.s': eTime
                        };
                        publicService.sendRequest('checkTimeSlot', params, function(msg) {
                            if (msg[0].h[0]['code.i'] == 0) {
                                vm.result = msg[1].b[0].result[0]['result.b'];
                                if (vm.result == 0) {
                                    vm.loginName = msg[1].b[0].result[0]['loginName.s'];
                                    // 根据id 查询会议室详情信息
                                    var params = {
                                        'ssoTicket.s': $rootScope.sso,
                                        'id.s': id
                                    };
                                    publicService.sendRequest('getRoomById', params, function(msg) {
                                        vm.isActive = false;
                                        if (msg[0].h[0]['code.i'] == 0) {
                                            vm.details = msg[1].b[0].room[0];
                                            var roomName = vm.details['name.s'];
                                            vm.carousels = $sce.trustAsResourceUrl(vm.details['coverImg.s']);
                                            $state.go('chooseUsers', {sTime: sTime, eTime: eTime, flag : 1,
                                                roomName: roomName,
                                                loginName: vm.loginName,
                                                roomId: id
                                            });
                                        }
                                    });


                                } else {
                                    var showPopup = $ionicPopup.alert({
                                        title: '预订重复', // String. 弹窗的标题。
                                        template: '预订时间内该会议室有预订请重新选择时间!',
                                        okText: '确定'
                                    });
                                }
                            }
                        });

                    }
                },{
                    text: '全天',
                    type: 'button-booking all-day',
                    onTap: function(e) {
                        var sTime = $scope.dateValue + ' 00:00:00';
                        var eTime = $scope.dateValue + ' 24:00:00';
                        //传递到后台 判断该会议室该时间是否被占用
                        var params = {
                            'ssoTicket.s': $rootScope.sso,
                            'roomId.s': id,
                            'startTime.s': sTime,
                            'endTime.s': eTime
                        };
                        publicService.sendRequest('checkTimeSlot', params, function(msg) {
                            if (msg[0].h[0]['code.i'] == 0) {
                                vm.result = msg[1].b[0].result[0]['result.b'];
                                if (vm.result == 0) {
                                    vm.loginName = msg[1].b[0].result[0]['loginName.s'];
                                    // 根据id 查询会议室详情信息
                                    var params = {
                                        'ssoTicket.s': $rootScope.sso,
                                        'id.s': id
                                    };
                                    publicService.sendRequest('getRoomById', params, function(msg) {
                                        vm.isActive = false;
                                        if (msg[0].h[0]['code.i'] == 0) {
                                            vm.details = msg[1].b[0].room[0];
                                            var roomName = vm.details['name.s'];
                                            vm.carousels = $sce.trustAsResourceUrl(vm.details['coverImg.s']);
                                            $state.go('chooseUsers', {sTime: sTime, eTime: eTime, flag : 1,
                                                roomName: roomName,
                                                loginName: vm.loginName,
                                                roomId: id
                                            });
                                        }
                                    });


                                } else {
                                    var showPopup = $ionicPopup.alert({
                                        title: '预订重复', // String. 弹窗的标题。
                                        template: '预订时间内该会议室有预订请重新选择时间!',
                                        okText: '确定'
                                    });
                                }
                            }
                        });

                    }
                }, {
                    text: '取消',
                    type: 'button-booking',
                    onTap: function(e) {
                        //取消暂时不需要任何处理
                    }
                }]
            });
        }

        function formatSrc(src) {
            return $sce.trustAsResourceUrl(src);
        }
        //初始化时间组件
        function changeDate(dateFlag) {
            var startDateObj;
            if (dateFlag) {
                $scope.dateValue = $filter('date')(dateFlag, 'yyyy-MM-dd');
            } else {
                $scope.dateValue = vm.today;
            }
            startDateObj = {
                //选择日期后的回调
                callback: function (val) {
                    $scope.dateValue = $filter('date')(val, 'yyyy-MM-dd');
                    startDateObj.inputDate = new Date(val); //更新日期弹框上的日期
                },
                from: new Date(2010, 1, 1),
                to: vm.maxDate,
                inputDate: new Date($scope.dateValue),
                mondayFirst: true,
                closeOnSelect: false,
                dateFormat: 'yyyy-MM-dd',
                templateType: 'popup'
            };
            //打开开始日期选择框
            $scope.dateOpen = function () {
                ionicDatePicker.openDatePicker(startDateObj);
            };
        }
        $scope.yesterdayClick = function () {
            var yDate = new Date($scope.dateValue);//获取当前时间
            yDate.setDate(yDate.getDate() - 1);//设置天数 -1 天
            vm.isActive = true;
            vm.changeDate(yDate);
            vm.isDisabled = false;
            vm.startRows = 0;
            vm.pageSize = 5;
            vm.rowsCount = 1;
            vm.getRoomList();
        };
        $scope.tomorrowClick = function () {
            var tDate = new Date($scope.dateValue);//获取当前时间
            tDate.setDate(tDate.getDate() + 1);//设置天数 +1 天
            vm.isActive = true;
            vm.changeDate(tDate);
            if ($scope.dateValue == $filter('date')(vm.maxDate, 'yyyy-MM-dd')) {
                vm.isDisabled = true;
            }
            vm.startRows = 0;
            vm.pageSize = 5;
            vm.rowsCount = 1;
            vm.getRoomList();
        };
        //获取会议室列表
        function getRoomList() {
            var dataStr = {
                'ssoTicket.s': $rootScope.sso,
                'seachDate.s': $scope.dateValue,
                'startRows.s': vm.startRows,
                'pageSize.s': vm.pageSize
            };
            publicService.sendRequest('getRoomList', dataStr, function(data) {
                console.log(JSON.stringify(data));
                vm.isActive = false;
                vm.code = data[0]['h'][0]['code.i'];
                if (vm.code == 0) {
                    // 判断是否执行滚动加载
                    if (data[1].b[0]['roomList'] != undefined) {
                        vm.listData = data[1].b[0]['roomList'].shift(); //count
                        vm.listItem = data[1].b[0]['roomList'];
                        vm.count = vm.listData['count.i'];
                        if (vm.count < vm.pageSize) {
                            vm.disabled = false;
                            if (vm.count == 0) {
                                vm.dataTips = '';
                            } else {
                                vm.dataTips = '数据已全部加载完成';
                            }
                        } else {
                            vm.disabled = true;
                            vm.dataTips = '';
                        }
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                } else {
                    // 模态框
                    $ionicLoading.show({
                        template: 'Sorry，数据加载出错！',
                        noBackdrop: true,
                        duration: 3000
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });
        }

        //下拉刷新
        function pushRefresh() {
            $timeout(function() {
                vm.startRows = 0;
                vm.rowsCount = 1;
               // vm.isActive = true;
                vm.getRoomList();
            }, 50);
            vm.disabled = true;
        }

        // 滚动加载
        function nextPage() {
            var dataStr = {
                'ssoTicket.s': $rootScope.sso,
                'seachDate.s': $scope.dateValue,
                'startRows.i': vm.rowsCount * vm.pageSize,
                'pageSize.i': vm.pageSize
            };
            publicService.sendRequest('getRoomList', dataStr, function(data) {
                vm.code = data[0]['h'][0]['code.i'];
                if (vm.code == 0) {
                    vm.empty = data[1].b[0]['value.s'];
                    if (vm.empty == undefined) {
                        vm.listData = data[1].b[0]['roomList'].shift(); //截取第一条数据
                        vm.item = data[1].b[0]['roomList'];
                        var len = vm.item.length;
                        if (len > 0) {
                            for (var i = 0; i < len; i++) {
                                vm.listItem.push(vm.item[i]);
                            }
                            vm.rowsCount ++;
                        } else {
                            vm.disabled = false;
                            vm.dataTips = '数据已全部加载完成';
                        }
                    } else {
                        vm.disabled = false;
                        vm.dataTips = '数据已全部加载完成';
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    // 模态框
                    $ionicLoading.show({
                        template: 'Sorry，数据加载出错！',
                        noBackdrop: true,
                        duration: 3000
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });
        }
        /*
         * 关闭轻应用
         */
        function closePage() {
            ns.runtime.closePage();
        }
    }
})();
