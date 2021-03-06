angular.module('mnServers').controller('mnServersAddDialogController',
  function ($scope, mnServersService, $modalInstance, mnHelper, groups) {
    reset();
    $scope.newServer = {
      hostname: '',
      user: 'Administrator',
      password: ''
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    function reset() {
      $scope.focusMe = true;
    }

    mnServersService.initializeServices($scope);

    $scope.isGroupsAvailable = !!groups;

    if ($scope.isGroupsAvailable) {
      $scope.selectedGroup = groups.groups[0];
      $scope.groups = groups.groups;
    }

    $scope.onSubmit = function (form) {
      if ($scope.viewLoading) {
        return;
      }

      form.$setValidity('services', !!mnHelper.checkboxesToList($scope.services).length);

      if (form.$invalid) {
        return reset();
      }

      var promise = mnServersService.addServer($scope.selectedGroup, $scope.newServer);
      promise.then(function () {
        $modalInstance.close();
        mnHelper.reloadState();
      });
      mnHelper.rejectReasonToScopeApplyer($scope, promise);
      mnHelper.handleSpinner($scope, promise, undefined, true);
    };
  });
