(function() {
  'use strict';
  angular
    .module('app')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$rootScope', 'ionicDatePicker', '$filter', 'getSSOticket', 'publicService' , '$ionicLoading', '$sce', '$timeout', '$ionicPopup', '$state'];

  function MainController($scope, $rootScope, ionicDatePicker, $filter, getSSOticket,  publicService , $ionicLoading, $sce, $timeout,$ionicPopup, $state) {
    var vm = this;
    var date = new Date();
    vm.maxDate = new Date(date.setDate(date.getDate() + 90));
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.isDisabled = false;
    vm.formatSrc = formatSrc;
    vm.closePage = closePage;
    vm.init = init;
    vm.getRecentConferenceApplyList = getRecentConferenceApplyList;
    vm.pushRefresh = pushRefresh;
    vm.nextPage = nextPage;
    vm.init();
    $rootScope.backStatus = 'close';

    function init() {
      // vm.startRows = 0;
      // vm.pageSize = 5;
      // vm.rowsCount = 1; // 滚动加载次数
      // vm.listData = '';
      // vm.listItem = '';
      // vm.isActive = true;
      // vm.disabled = true; // 滚动加载开关
      $scope.$on('$ionicView.afterEnter', function(){
        console.log($rootScope.sso)
        if ($rootScope.sso == undefined || $rootScope.sso == '' ) {
          getSSOticket.getTicket(function () {
            vm.getRecentConferenceApplyList();
          });
        } else {
          vm.getRecentConferenceApplyList();
        }
      });
    }
    function formatSrc(src) {
      return $sce.trustAsResourceUrl(src);
    }

    //获取会议室列表
    function getRecentConferenceApplyList() {
      var dataStr = {
        'ssoTicket.s': $rootScope.sso,
        'userId': $scope.dateValue,
        'orderBy': vm.startRows,
        'pageSize.s': vm.pageSize
      };
      publicService.sendRequest('getRecentConferenceApplyList', dataStr, function(data) {
        console.log(data);
        vm.isActive = false;
        vm.code = data.status?0:-1;
        if (vm.code === 0) {
          // 判断是否执行滚动加载
          if (data.data.datas && data.data.datas.length) {
            // vm.listData = data.data.datas.shift(); //count
            vm.listItem = data.data.datas;
            vm.count = data.data.count;
            console.log(vm.listData,vm.listItem)
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
        vm.getRecentConferenceApplyList();
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
