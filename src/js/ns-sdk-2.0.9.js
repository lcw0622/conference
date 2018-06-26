/**
 * @version 2.0.9
 */
;
(function(win) {
	//方法列表
	var METHODS = [
		//设备功能类
		"device.userAvatarUrl",	//头像
		"device.start", //调起应用(Activity)
		"device.getBatteryinfo", //获取电池信息
		"device.getConnection", //获取当前网络连接方式
		"device.getDeviceImei", //获取设备IMEI信息
		"device.getDeviceSysVersion", //获取设备的系统版本信息
		"device.getDeviceModelName", //获取设备的名称
		"device.getScreenSize", //获取设备的屏幕分辨率
		"device.location", //获取当前GPS经纬度
		"device.imagePicker", //调取本地图库，选择图片
		"device.startCaptureQRCode", //启动二维码扫描与识别
		"device.initGoBack", //启动原生返回跟h5返回同步功能
		//门户功能类
		"runtime.networkPost", //网络请求 POST
		"runtime.networkGet", //网络请求 GET
		"runtime.uploadFile", //上传文件到云文件服务器
		"runtime.downloadFile", //下载文件
		"runtime.showPasswordLock", //应用密码锁
		"runtime.contact", //从组织架构选人(多选)（原：查找并选择联系人）
		"runtime.selectUserFromContact", //从常用联系人选择人员
		"runtime.addressBook", //打开门户通讯录
		"runtime.sharePerence", //本地存储数据操作
		"runtime.setTitleBG", //设置标题背景颜色
		"runtime.setTitleColor", //设置标题颜色
		"runtime.setTitle", //设置标题内容
		"runtime.closePage", //关闭webView
		"runtime.menu", //设置标题更多按钮
		"runtime.getUserInfoById", //获取指定ID人员的信息
		"runtime.showUserInfoById", //唤起指定ID的人员详情页
		"runtime.getDepartmentInfoById", //获取指定ID部门的信息
		"runtime.selectDepartmentFromOrgan", //从组织架构选择部门
		"runtime.selectUserFromOrgan", //从组织架构选择人员
		"runtime.appAuthorization", //获取SSOTicket
		"runtime.photoBorwser", //图片浏览器
		"runtime.userinfo", //获取个人信息
		"runtime.share", //分享
		"runtime.keyboard", //打开安全键盘
		"runtime.selectDocuments", //选择云文件
		"runtime.login", //SSO单点登录
		"runtime.loginout", //注销当前登录账号
		"runtime.startLightApp", //调起其他应用并传参
		"runtime.hiddenNavBar", //隐藏原生Title
		"runtime.camera", //调起相机
		"runtime.appProfileInfo", //获取轻应用profile配置
		"runtime.openAPIRequest", //通过openAPI发送请求
		"runtime.appInfo", //获取当前轻应用信息
		"runtime.statistics", //发送统计信息
		"runtime.parkPlatformInfo", //获取园区信息
		"runtime.getFileFromCloudDisk" //获取云盘文件信息.
	];
	var ua = win.navigator.userAgent;
	var ns = {
		version: '2.0.9', //框架变化+SDK增加+SDK功能修复更新
		ios: (/iPhone|iPad|iPod/i).test(ua),
		android: (/Android/i).test(ua),//TODO:需要改善 dingding
		ready: function(obj) { //TODO:obj是否可以用config方式处理？callBcak呢？参考JQUERY方式
			var fn = function(bridge, obj) {
				if(!bridge) {
					//return console.log('bridge初始化失败');
					console.log('bridge初始化失败');
				};
				bridge.init(function(message, responseCallback) {
					responseCallback(data);
				});
				if(obj == undefined) {
					return;
				}
				for(var i in obj) { //TODO: 下边的判断需要优化 switch case方式？
					if(i == 'push') {
						bridge.registerHandler("push", function(data, responseCallback) {
							obj['push'](data);
						});
					}
					if(i == 'intent') {
						bridge.registerHandler("intent", function(data, responseCallback) {
							obj['intent'](data);
						});
					}
					if(i == 'pluginInit') {
						bridge.registerHandler("pluginInitFinished", function(data, responseCallback) {
							obj['pluginInit']();
						});
					}
					if(i == 'init') {
						bridge.registerHandler("init", function(data, responseCallback) {
							obj['init'](data);
						});
					}
					if(i == 'goBack') {
						bridge.registerHandler('goBack', function(data, responseCallback) {
							obj['goBack'](responseCallback);
						});
					}
				}
			};
			//TODO:已经初始化未考虑
			//WebViewJavascriptBridge初始化
			/* TODO: 当ns.ready()直接运行时执行else里的方法，当ns.ready()通过click事件触发执行时window.WebViewJavascriptBridge为真。
			 * 此时是否可以依靠此特性解决，当页面运行ns.ready()后直接运行SDK的一种方式？
			 **/
			if(window.WebViewJavascriptBridge) {
				fn(WebViewJavascriptBridge, obj);
			} else {
				document.addEventListener(
					'WebViewJavascriptBridgeReady',
					function() {
						fn(WebViewJavascriptBridge, obj);
					},
					false
				);
			};
		}
	};
	//注册命名空间
	var nameSpace = function(method, fn) {
		var arr = method.split('.');
		var n = ns;
		for(var i = 0, k = arr.length; i < k; i++) {
			if(i === k - 1) {
				n[arr[i]] = fn;
			}
			if(typeof n[arr[i]] === 'undefined') {
				n[arr[i]] = {};
			}
			n = n[arr[i]];
		}
	};
	//当Key的值为undefined时，重置为默认值
	function setDefaultValue(obj, defaults) {
		for(var i in defaults) {
			obj[i] = obj[i] !== undefined ? obj[i] : defaults[i];
		}
	};
	//集中处理参数以及回调
	function factory(method, param) {
		if(typeof WebViewJavascriptBridge === 'undefined') {
			alert('factory WebViewJavascriptBridge未定义');
		}
		var p = param || {};
		//默认回调方法：如果没有定义回调的话，会自动使用以下回调
		var successCallback = function(res) {
			console.log('默认成功回调', method, res);
		}
		var failCallback = function(err) {
			console.log('默认失败回调', method, err);
		};
		//重置默认回调方法：使用用户定义回调替换默认回调
		if(p.onSuccess) {
			successCallback = p.onSuccess;
			delete p.onSuccess;
			//			console.log(successCallback);
		};
		if(p.onFail) {
			failCallback = p.onFail;
			delete p.onFail;
			//			console.log(failCallback);
		};
		//统一回调处理
		var callBack = function(response) {
			try {
				var msg = JSON.parse(response);
			} catch(e) {
				var errorMsg = "客户端返回response解析错误，错误描述：" + e + "response信息：" + response;
				var msg = {
					"code": "1",
					"obj": errorMsg
				}
			}
			var code = msg.code;
			if(code == "0") {
				//TODO:此code为客户端返回，并不能代表服务器返回code，需要进一步判断，在决定是否调用successCallbak或failCallback
				successCallback(msg);
			} else {
				failCallback(msg);
			}
		};
		//TODO： 对应的setDefaultValue待完善
		//对method的参数进行处理、注册客户端调用方法
		switch(method) {
			case 'device.start':
				setDefaultValue(p, {
					"URLScheme": "",
					"intent": ""
				});
				if(ns.android) {
					delete p.URLScheme;
				} else if(ns.ios) {
					delete p.intent;
					p.URLScheme = p.URLScheme + '://';
				}
				break;
			case 'runtime.networkPost':
			case 'runtime.networkGet':
				setDefaultValue(p, {
					"group": "",
					"isCompres": false,
					"isSalt": false,
					"encryptionType": "01",
					"Ishttps": "02",
					"targetUrl": "",
					"isExternal": false
				});
				break;
			case 'runtime.selectUserFromContact':
			case 'runtime.selectDepartmentFromOrgan':
			case 'runtime.contact':
				break;
			case 'runtime.keyboard': //TODO：注册的方法 可能需要修改，参考设置更多的方法
				WebViewJavascriptBridge.registerHandler('keyboardInput', function(data, responseCallback) {
					p.callBack(data);
				});
				break;
			case 'runtime.menu': //TODO：是否需要对参数的正确进行判断
				if(p.method !== '') {
					p.items = []; //p.method不为空的时候，items无论是否存在都设置为空数组；
					var methodFn = p.methodFn; //TODO:p.methodFn如果为空，怎么处理？参考上传
					delete p.methodFn;
					WebViewJavascriptBridge.registerHandler(p.method, function(data, responseCallback) { //TODO:注册的回调需要调整，参考上传
						methodFn(data);
					});
				} else if(p.method == '' && p.items instanceof Array && p.items.length > 0) {
					//如果p.method为空且p.methodFn存在则删除p.methodFn;
					if(p.hasOwnProperty("methodFn")) {
						delete p.methodFn;
					}
					for(var i = 0; i < p.items.length; i++) {
						var itemFn = p.items[i].methodFn;
						delete p.items[i].methodFn;
						WebViewJavascriptBridge.registerHandler(p.items[i].method, itemFn);
					}
				} else {
					console.log("设置更多菜单参数错误，请检查")
				}
				break;
			case 'runtime.uploadFile':
				setDefaultValue(p, {
					"fileName": "",
					"uploadCallBack": ""
				});
				var callBcakFn = p.uploadCallBack;
				p.uploadCallBack = "uploadCallBack";
				WebViewJavascriptBridge.registerHandler('uploadCallBack', callBcakFn);
				break;
			case 'runtime.downloadFile':
				if(p.url !== undefined && p.fileToken !== undefined) { //如果url与fileToken参数都存在，则使用url
					delete p.fileToken;
				}
				setDefaultValue(p, {
					"dowloadCallBack": ""
				});
				var callBcakFn = p.dowloadCallBack;
				p.dowloadCallBack = "dowloadCallBack";
				WebViewJavascriptBridge.registerHandler('dowloadCallBack', callBcakFn);
				break;
			case 'runtime.sharePerence':
				if(p.opt == "remove" || p.opt == "get" || p.opt == "clear" && p.value !== undefined) {
					delete p.value;
				}
				if(p.opt == "clear" && p.key !== undefined) {
					delete p.key;
				}
				break;
			case 'runtime.photoBorwser':
				setDefaultValue(p, {
					"index": "0",
					"isFullPath": false
				});
				break;
			case 'runtime.selectDocuments':
				setDefaultValue(p, {
					"multiple": false
				});
				break;
			case 'device.startCaptureQRCode':
				setDefaultValue(p, {
					"codeType": "0",
					"needResult": false
				});
				break;
			case 'runtime.startLightApp':
				setDefaultValue(p, {
					"fromKey": "",
					"toKey": "",
					"action": "",
					"type": ""
				});
		}
		var arr = method.split('.');
		var suff = arr.pop();
//		alert("方法：：" + suff + "\n 参数：：" + JSON.stringify(p));
		WebViewJavascriptBridge.callHandler(suff, p, callBack);
	};
	//动态生成API
	METHODS.forEach(function(method) {
		nameSpace(method, function(param) {
			factory(method, param);
		});
	});
	ns._nameSpace = nameSpace;
	win.ns = ns;
})(this);