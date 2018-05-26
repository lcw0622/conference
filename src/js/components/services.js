(function () {
  'use strict';

  angular.module('app')
    .factory('publicService', publicService)
    .factory('getSSOticket', getSSOticket);

  // publicService
  function publicService($http, $ionicLoading, postURL, postAPI) {
    return {
      sendRequest: function (postMethod, bObj, callBack) {
        // $http({
        //     'url': postURL,
        //     'headers': {
        //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //         'Accept': '*/*'
        //     },
        //     'method': 'POST',
        //     'data': {
        //         'req': [{
        //             'h': [{
        //                 'u.s': '?i=' + postAPI + '&m=' + postMethod
        //             }]
        //         }, {
        //             'b': [bObj]
        //         }]
        //     }
        // }).then(function (response) {
        //     //console.log('PostMethod：', postMethod, '\n Post param:', bObj, '\n Response:', response.data.res);
        //     callBack(response.data.res);
        // }, function (response) {
        //     console.log('失败的网络请求：', response);
        //     //alert('失败的网络请求：' + JSON.stringify(response));
        //     // 模态框
        //     $ionicLoading.show({
        //         template: '网络连接错误',
        //         noBackdrop: true,
        //         duration: 3000
        //     });
        // });


        // 假数据
        var url = '/js/json/' + postMethod + '.json';
        var base = 'http://121.196.221.153:8085/meeting-manager/conferenceOpenApi/'
        var params = {}
        var method = 'GET'
        var userId = '402881f761d6c2ce0161d6c2d5850000'

        switch (postMethod) {
          case 'getMySubscribe': {
            url = base + 'recentConferenceApplyList'
            params = {userId: userId, orderBy: 1}
            method = 'POST'
            break;
          }
        }
        $http({
          method: 'GET',
          url: url,
          params: params
        }).then(function (response) {
          // alert('message?: DOMString')
          console.log(response);
          callBack(response.data);
        }, function (response) {
          console.log('失败的网络请求：', response);
          //alert('失败的网络请求：' + JSON.stringify(response));
          // 模态框
          $ionicLoading.show({
            template: '网络连接错误',
            noBackdrop: true,
            duration: 3000
          });
        });
        // over

      }
    };
  }

  // getSSOticket
  function getSSOticket($rootScope, $state, $ionicHistory, $location) {
    return {
      getTicket: function (callBack) {
        console.log(ns)
        ns.ready({
          'push': function (msg) {
            $rootScope.id = angular.fromJson(msg).args;
          },
          'pluginInit': function () {
            ns.runtime.appAuthorization({
              'onSuccess': function (st) {
                $rootScope.sso = st['obj']['ssoTicket'];
                if ($rootScope.id == undefined || $rootScope.id == '') {
                  callBack();
                } else {
                  $state.go('chooseUsers', {'flag': 2, 'id': $rootScope.id});
                }

              },
              'onFail': function (err) {
                console.log('sso失败', err);
              }
            });
            if (ns.android == true) {
              ns.device.initGoBack({
                'isBackBound': true,
                'onSuccess': function (msg) {
                  // alert('成功' + JSON.stringify(msg));
                },

                'onFail': function (msg) {
                  // alert('失败' + JSON.stringify(msg));
                }
              });
            }
          },
          'goBack': function (responseCallback) {
            // 关闭
            if ($rootScope.backStatus == 'close') {
              ns.runtime.closePage();
            }

            // 详情
            if ($rootScope.backStatus == 'detail') {
              if ($rootScope.backType == 'push') {
                ns.runtime.closePage();
              } else {
                $ionicHistory.goBack();
              }

            }

            if ($rootScope.backStatus == 'list' || $rootScope.backStatus == 'search') {
              $ionicHistory.goBack();
            }

            var returnDate = {};
            //判断是否是首页
            if ($location.path() != '/list') {
              returnDate.isNotRoot = true;
            } else {
              returnDate.isNotRoot = false;
            }
            // alert(JSON.stringify(returnDate));
            responseCallback(returnDate);
          }
        });
      }
    };
  }

})();