angular.module('mnPoolDefault').factory('mnPoolDefault',
  function (mnHttp, $cacheFactory, $q, mnPools) {
    var mnPoolDefault = {};

    mnPoolDefault.get = function () {
      return $q.all([
        mnHttp({
          method: 'GET',
          url: '/pools/default?waitChange=0',
          responseType: 'json',
          cache: true,
          timeout: 30000
        }),
        mnPools.get()
      ]).then(function (resp) {
        var poolDefault = resp[0].data;
        var pools = resp[1]
        poolDefault.rebalancing = poolDefault.rebalanceStatus !== 'none';
        poolDefault.isGroupsAvailable = !!(pools.isEnterprise && poolDefault.serverGroupsUri);
        return poolDefault;
      });
    };

    mnPoolDefault.clearCache = function () {
      $cacheFactory.get('$http').remove('/pools/default?waitChange=0');
      return this;
    };

    mnPoolDefault.getFresh = function () {
      return mnPoolDefault.clearCache().get();
    };

    return mnPoolDefault;
  });
