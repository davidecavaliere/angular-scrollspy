/**
@toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
TODO

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
TODO

@dependencies
TODO

@usage
partial / html:
TODO

controller / js:
TODO

//end: usage
*/

'use strict';

angular.module('davidecavaliere.angular-scrollspy', [])

.value('config', {
	'offset': 300,
	'delay': 100
})

.run(['PositionFactory', function(PositionFactory) {
  PositionFactory.refreshPositions();
  angular.element(window).bind('scroll', function() {
    PositionFactory.refreshPositions();
  });
}])
.factory('PositionFactory', ['$rootScope', function($rootScope){
  return {
    'position': [],
    'refreshPositions': function() {
      this.position.documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
      this.position.windowTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
      this.position.windowBottom = this.position.windowTop + window.innerHeight
    }
  }
}])

.directive('scrollspyTrigger', function (config, scrollspyConfig, $timeout, PositionFactory, $log) {
	return {
		restrict : 'A',
		scope : {
			scrollspyTrigger : '='
		},
		link : function(scope, element, attrs) {
			angular.extend(config, scrollspyConfig.config);

			$log.debug('scrollspyTrigger', scope.scrollspyTrigger);
			scope.checkActive = function() {
				var offset = parseInt(attrs.scrollspyOffset || config.offset);

				scope.phase = 'out'; // phase is one of out, entering, in, leaving
				// indicating if the element is enterting, in, leaving or out of the page

				var elementTop = element[0].offsetTop;
				var elementHeight = element[0].offsetHeight;
				var elementBottom = elementTop + elementHeight;

				// or windowTop if you want
				var scrollTop = angular.element(document.body)[0].scrollTop;
				// $log.debug('document scroll offset', scrollTop);
				// $log.debug('element : ', element, 'offset top', elementTop);

				var windowHeight = window.innerHeight;

				// window bottom
				var windowBottom = scrollTop + window.innerHeight;

					// the bottom of the element is at coords
				var elementBottom = elementTop + element[0].offsetHeight;
				// $log.debug('element bottom', elementBottom, 'window bottom', windowBottom);

				var top = scrollTop + offset;
				var bottom = windowBottom - offset;

				if (elementTop > bottom || elementBottom < top) {
					$log.debug('element is outside the window');
					scope.phase = 'out';
					$log.debug('element ', element, 'is ' + scope.phase);

				} else {
					scope.phase = 'in';
					$log.debug('element ', element, 'is ' + scope.phase);
				}

				$log.debug('emiting scrollspy:' + scope.scrollspyTrigger, scope.phase);
				scope.$parent.$broadcast('scrollspy:' + scope.scrollspyTrigger, scope.phase);
			}

			if (config.throttle) {
				angular.element(window).bind('scroll', config.throttle(function() { scope.checkActive() }, config.delay));
			} else {
				$timeout(function() {
					angular.element(window).bind('scroll', function() { scope.checkActive() });
				}, config.delay);
			}

			scope.$$postDigest(function() {
				scope.checkActive();
			})
			// angular.element(document).ready( function() { scope.checkActive() });
			angular.element(window).bind('resize', function () { scope.checkActive() });

			element.append(scope.phase);
		}

	}
})

.directive('scrollspyReceiver', function ($log) {

	return {
		restrict: 'A',
		scope: {
			scrollspyReceiver : '='
		},

		link: function(scope, element, attrs) {
			scope.$on('scrollspy:' + scope.scrollspyReceiver, function(event, phase) {
					$log.debug('got scrollspy:'  + scope.scrollspyReceiver, phase);

					if (phase == 'out') {
						element.removeClass('active');
					} else if (phase == 'in') {
						element.addClass('active');
					} else if (phase == 'leaving') {
						// we may want to add animation here
					} else if (phase == 'entering') {
						// we may want to add animation here
					}
			});
		},

		controller: function($scope, $element, $attrs) {

		}
	};
})

.provider('scrollspyConfig', function() {
  var self = this;
  this.config = {};
  this.$get = function() {
    var extend = {};
    extend.config = self.config;
    return extend;
  };
  return this;
});

;
