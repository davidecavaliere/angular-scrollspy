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
	'offset': 200,
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

.directive('scrollspyTrigger', function (config, scrollspyConfig, /*SpyFactory,*/ PositionFactory, $log) {
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

				// or windowTop if you want
				var scrollTop = angular.element(document.body)[0].scrollTop + offset;
				// $log.debug('document scroll offset', scrollTop);
				// $log.debug('element : ', element, 'offset top', elementTop);

				var windowHeight = window.innerHeight;

				// window bottom
				var windowBottom = scrollTop + window.innerHeight;

					// the bottom of the element is at coords
				var elementBottom = elementTop + element[0].offsetHeight;
				// $log.debug('element bottom', elementBottom, 'window bottom', windowBottom);

				if (!(elementHeight < windowHeight)) { // if elementHeight >= windowHeight
					if (elementTop > windowBottom || elementBottom < scrollTop) {
						scope.phase = 'out';
						$log.debug('element ', element, 'is ' + scope.phase);
					}	else if (elementTop >= scrollTop) {
						scope.phase = 'entering';
						$log.debug('element ', element, 'is ' + scope.phase);
					} else if (elementBottom > scrollTop && elementBottom < windowBottom) {
						scope.phase = 'leaving';
						$log.debug('element ', element, 'is ' + scope.phase);
					} else if (elementTop < scrollTop && elementBottom >= windowBottom ) {
						scope.phase = 'in';
						$log.debug('element ', element, 'is ' + scope.phase);
					}
				} else {
					if (elementTop > windowBottom || elementBottom < scrollTop) { // element is out of the page
						scope.phase = 'out';
						$log.debug('element ', element, 'is ' + scope.phase);
					} else if ( elementBottom > windowBottom) { // until elementBottom is out of the page
						// the element is entering
						scope.phase = 'entering';
						$log.debug('element ', element, 'is ' + scope.phase);
					} else if (
						// element is fully on page
						elementBottom <= windowBottom && elementTop >= scrollTop
					) {

						// since here we process elements that are smaller than the window height
						// we may have more than one element fully on page at time
						// we may need to weight the position of the element regarding the page
						scope.phase = 'in';
						$log.debug('element ', element, 'is ' + scope.phase);
					} else if (elementBottom >= scrollTop && elementTop < scrollTop) {
						// element is leaving the page
						scope.phase = 'leaving';
						$log.debug('element ', element, 'is ' + scope.phase);
					}
				}
				$log.debug('emiting scrollspy:' + scope.scrollspyTrigger, scope.phase);
				scope.$parent.$broadcast('scrollspy:' + scope.scrollspyTrigger, scope.phase);
			}

			if (config.throttle) {
				angular.element(window).bind('scroll', config.throttle(function() { scope.checkActive() }, config.delay));
			} else {
				angular.element(window).bind('scroll', function() { scope.checkActive() });
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
