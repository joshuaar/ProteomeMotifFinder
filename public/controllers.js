var myApp = angular.module('myApp', [], function ($interpolateProvider) {
                    $interpolateProvider.startSymbol('[[');
                     $interpolateProvider.endSymbol(']]');
                     });
//This script is for displaying the filtered protein data
myApp.controller('proteinDisplay',function($scope,$http,$timeout){
    $scope.someText = ["abc","cde","efg"]
    $scope.regExFilter=function(protein){
        var patt=new RegExp($scope.filterText,"i");
        return patt.test(protein.seq);
    }

    $scope.filterText = '';

    var tempFilterText = '',
        filterTextTimeout;

    $scope.$watch('regEx',function(val){
        if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
        //window.alert("HIO")
        tempFilterText = val;
        filterTextTimeout = $timeout(function(){
            $scope.filterText = tempFilterText;
            //window.alert("HEU")
            },400)
        })

});

