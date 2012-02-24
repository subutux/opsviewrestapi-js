/*
COPYRIGHT

Copyright 2012 Stijn Van Campenhout <stijn.vancampenhout@gmail.com>

This file is part of opsviewrestapi-js.

opsviewrestapi-js is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

opsviewrestapi-js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with opsviewrestapi-js; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
*/

/**
 * Add a clone function to objects
 * Allows you to clone an object instead of linking to it.
 * !LOOPHOLE!
 * using JSON.parse(JSON.stringify(var)) for now.

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  console.log(this);
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};
 */
/**
 * Add a has function to Arrays
 * Allows you to quickly check if v key exists in an array.
 */ 
Array.prototype.has=function(v){
	for (var j=0;j<this.length;j++){
		if (this[j]==v) return true;
	}
	return false;
}

/**
 * opsview REST API client for javascript
 * See http://docs.opsview.org/doku.php?id=opsview-community:restapi&s[]=json&s[]=api for more information
 *
 * @author Stijn Van Campenhout <stijn.vancampenhout@gmail.com>
 * @version 1.0
 */

opsviewrestapi = function(o){

	that = this;
	/**
	 * Common configuration parameters
	 */
	this.config  = {
		'server': {
			'host': "localhost",
			'user': "admin",
			'pass': "initial",
			'port': 3000
		}
	};
	/**
	 * Common settings
	 * @todo: use this.
	 */
	this.settings = {
		'timeout' : 5,
		'minVersion' : 3.013002
	}
	/**
	 * stores common variables like the headers to be sent
	 */
	this.vars = {
		'headers' : {},
		'token' : ""
	}

	/**
	 * All available opsview REST API calls
	 */
	this.apis = {
		'version' : {
			'url' : '/rest',
			'method' : 'GET',
			'methods' : ['GET'],
			'request' : {}
		},
		'info' : {
			'url' : '/rest/info',
			'method' : 'GET',
			'methods' : ['GET'],
			'request' : {}
		},
		'reload' : {
			'url' : '/rest/reload',
			'method' : 'GET',
			'methods' : ['GET','POST'],
			'request' : {}
		},
		'serverinfo' : {
			'url' : '/rest/serverinfo',
			'method' : 'GET',
			'methods' : ['GET'],
			'request' : {}
		},
		'login' : {
			'url' : '/rest/login?request_onetime_token=1&another_test=test&another_test=tet',
			'method': 'POST',
			'methods' : ['POST'],
			'request': {}
		},
		'event' : {
			'url' : '/rest/event',
			'method' : 'GET',
			'methods' : ['GET'],
			'request': {}
		},
		'downtime' : {
			'url' : '/rest/hostgroup',
			'method': 'GET',
			'methods' : ['GET','POST','DELETE'],
			'request': {}
		},
		'acknowledge' : {
			'url' : '/rest/acknowledge',
			'method': 'GET',
			'methods' : ['GET','POST'],
			'request': {}
		},
		'recheck' : {
			'url' : '/rest/recheck',
			'method': 'GET',
			'methods' : ['GET','POST'],
			'request': {}
		},
		'graph' : {
			'url' : '/rest/graph',
			'method': 'GET',
			'methods' : ['GET'],
			'request': {}
		},
		'config' : {
			'host' : {
				'url' : '/rest/config/host/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'contact' : {
				'url' : '/rest/config/contact/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'role' : {
				'url' : '/rest/config/role/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'servicecheck' : {
				'url' : '/rest/config/servicecheck/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'hosttemplate' : {
				'url' : '/rest/config/hosttemplate/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'attribute' : {
				'url' : '/rest/config/attribute/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'timeperiod' : {
				'url' : '/rest/config/timeperiod/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'hostgroup' : {
				'url' : '/rest/config/hostgroup/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'servicegroup' : {
				'url' : '/rest/config/servicegroup/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'notificationmethod' : {
				'url' : '/rest/config/notificationmethod/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'hostcheckcommand' : {
				'url' : '/rest/config/hostcheckcommand/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'keyword' : {
				'url' : '/rest/config/keyword/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			},
			'monitoringservers' : {
				'url' : '/rest/config/monitoringserver/',
				'method' : 'GET',
				'methods' : ['GET','POST','PUT','DELETE'],
				'request' : {}
			}
		},
		'runtime' : {
			'service' : {
				'url' : '/rest/runtime/service',
				'method': 'GET',
				'methods' : ['GET'],
				'request': {}
			},
			'performancemetric' : {
				'url' : '/rest/runtime/performancemetric',
				'method': 'GET',
				'methods' : ['GET'],
				'request': {}
			}
		},
		'status' : {
			'hostgroup' : {
				'url' : '/rest/status/hostgroup',
				'method': 'GET',
				'methods' : ['GET'],
				'request': {}
			},
			'host' : {
				'url' : '/rest/status/host',
				'method': 'GET',
				'methods' : ['GET'],
				'request': {}
			},
			'service' : {
				'url' : '/rest/status/service',
				'method': 'GET',
				'methods' : ['GET'],
				'request': {}
			},
			'viewport' : {
				'url' : '/rest/status/viewport',
				'method': 'GET',
				'methods' : ['GET'],
				'request': {}
			}
		}
	
	}

	/**
	 * Opsview REST API builder
	 * Allows you to build an API call
	 * for usage see example.js
	 * @param string url: the rest api url without the initial '/rest'
	 * 				 for ex. 'config/host'
	 *
	 */
	this.api = function(url){
		var apiArr = url.split('/');
		var myapi = that.apis;
		for (i in apiArr){
			if (typeof apiArr[i] != "undefined" && typeof myapi[apiArr[i]] != "undefined"){
				myapi = myapi[apiArr[i]];
			}
		}
		if (typeof myapi.url == "undefined"){
			console.error('no such api known: ' + url);
			return false;
		}
		this.__api__ = JSON.parse(JSON.stringify(myapi));
		this.url = this.__api__.url;
		this.method = this.__api__.method;
		this.ops = this.__api__.request;
		if (this.__api__.methods.has("GET")){
			this.get = function(callback){
				var reqApi = {};
				reqApi.url = this.url;
				reqApi.request = this.ops;
				reqApi.method = "GET";
				that.__request__(reqApi,function(data){
					callback(data);
					});
			};
		}
		if (this.__api__.methods.has("POST")){
			this.post = function(callback){
				var reqApi = {};
				reqApi.url = this.url;
				reqApi.request = this.ops;
				reqApi.method = "POST";
				that.__request__(reqApi,function(data){
					callback(data);
					});
			};
		}
		if (this.__api__.methods.has("PUT")){
			this.put = function(callback){
				var reqApi = {};
				reqApi.url = this.url;
				reqApi.request = this.ops;
				reqApi.method = "PUT";
				that.__request__(reqApi,function(data){
					callback(data);
					});
			};
		}
		if (this.__api__.methods.has("DELETE")){
			this.delete = function(callback){
				var reqApi = {};
				reqApi.url = this.url;
				reqApi.request = this.ops;
				reqApi.method = "DELETE";
				that.__request__(reqApi,function(data){
					callback(data);
					});
			};
		}
	};
	/**
	 * The main error handler
	 * called by this.__request__::$.ajax on failure
	 */
	this.errorHandler = function(jqHXR,textStatus,apiObj){
		alert('error:' + textStatus);
		console.log(jqXHR);
		console.log('http://' + that.config.server.host + ":" + that.config.server.port + apiObj.url);
	}
	/**
	 * Set the server parameters
	 * @param string server: server name (since cross-domain calls is forbidden in most browsers,
	 * this MUST be the same host as from where you are running this js)
	 * @param int port: server port (see notice above)
	 */
	this.server = function(host,port){
		that.config.server.host = host;
		that.config.server.port = (typeof(port) != "undefined")? port: that.config.server.port;
		return that.config.server;
	}
	/**
	 * RESTProxy.php support - tunnel all requests trough a local php script
	 * @param string location: location of the RESTProxy.php script
	 */
	 this.proxy = function(location){
	 	that.vars.headers['x-RESTProxy-Host'] = that.config.server.host;
	 	that.vars.headers['x-RESTProxy-Port'] = that.config.server.port;
	 	that.config.server.useProxy = location;
	 }

	/**
	 * @todo: implement a check version;
	 */
	this.checkVersion = function() {
	/*	var api = that.apis.version;
		that.__request__(api,function(data){
			if (data.api_version < that.settings.minVersion){
				console.log("Api version is to low on server.")
				return false;
			} else {
				return true;
			}
		});
	*/
	//TODO: Version check
	return true;
	}
	/**
	 * The initial authentication
	 * @param string user: Opsview username
	 * @param string pass: Opsview password
	 *
	 * Sets the approriate headers
	 */
	this.authenticate = function(user,pass,callback,errorCallback) {
		errorCallback = (typeof errorCallback == "undefined") ? that.errorHandler : errorCallback;

		c = (typeof callback == "undefined")? function(data){return true;} : callback;
		that.config.user = user;
		that.config.pass = pass;
		var api = that.apis.login;
		api.request.username = user;
		api.request.password = pass;
		that.__request__(api,function(data){
			that.vars.token = data.token;
			that.vars.headers['X-Opsview-Username'] = that.config.user;
			that.vars.headers['X-Opsview-Token'] = that.vars.token;
			c(data);
		},function(xhr,textStatus){errorCallback(xhr,textStatus);});
	};

	this.status = {};

	this.status.hostgroup = function(params,callback){
		var api = new api('status/hostgroup')
		api.request = params;
		that.__request__(api,function(data){callback(data)});
	};
	
	this.status.host = function(params,callback){
		var api = new that.api('status/host')
		api.ops = params;
		that.__request__(api,function(data){callback(data)});
	};
	/**
	 * Encode the apiObj.request to an urlencoded GET request
	 * 
	 * @param object apiObj.request
	 * @private
	 */
	this.urlEncodeObject = function(obj){
	 var url = ""
	 for (i in obj) {
	 	// of the opt content is an array,
	 	// loop trough the array and set
	 	// the opt multiple times vor each
	 	// array content.
	 	// ex. cols=host_name&cols=hostgroup&...
	 	if ( obj[i] instanceof Array){
	 		for (a in obj[i]){
	 			if (typeof obj[i][a] == "string"){
		 			if (url != ""){
		 				url += "&";
		 			}
	 				url += i + "=" + escape(obj[i][a]).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');
	 			}
	 		}
	 	} if (typeof obj[i] == "string"){
	 		if (url != ""){
	 				url += "&";
	 			}
	 			url += i + "=" + escape(obj[i]).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');
	 	}
	 }
	 return url;
	}
	/**
	 * The main request function
	 * @param object apiObj: Special object containing the api information
	 * @param function callback
	 *
	 */
	this.__request__ = function(apiObj,callback,errorCallback){
		/**
		 * Include the headers
		 * @param object xhr: the xhr transfer object
		 * @private
		 */
		function setHeaders(xhr){
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			for (header in that.vars.headers){
				if (typeof that.vars.headers[header] != "undefined"){
					//console.log('setting header: ' + header);
					xhr.setRequestHeader(header,that.vars.headers[header]);
				}
			}
		}
		var data = (apiObj.method == "GET")? that.urlEncodeObject(apiObj.request) : JSON.stringify(apiObj.request);
		var url = (typeof that.config.server.useProxy == "undefined")?'http://' + that.config.server.host + apiObj.url : that.config.server.useProxy + apiObj.url;
		$.ajax({
			url:url,
			type:apiObj.method,
			data:data,
	 		contentType:"application/json",
			dataType:"json",
			beforeSend: function(xhr){
				setHeaders(xhr);
			},
			error: function(xhr,textStatus){
				if (typeof errorCallback == "undefined"){
					that.errorHandler(xhr,textStatus,apiObj);
				} else {
					errorCallback(xhr,textStatus);
				}
			},
			success: function(r,textStatus,xhr){
				r.status = {};
				r.status.readyState = xhr.readyState;
				r.status.status = xhr.status;
				r.status.statusText = xhr.statusText;
				callback(r);
			}
		});
	}

}