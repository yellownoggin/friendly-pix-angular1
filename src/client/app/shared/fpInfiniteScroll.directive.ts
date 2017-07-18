namespace friendlyPix {
    'use strict';

    // TODO Important: Directive Sidelined:
    // for infinite-scroll directive project
    // This uses the same or similar logic and works - but IS project more thorough


    angular
        .module('app.shared')
        .directive('fpInifiniteScroll', fpInifiniteScroll);


    function fpInifiniteScroll($timeout, $window, $document) {
        return {
            restrict: 'A',
            link: (scope, el, attr) => {
                /**
                 * 1. get element to use in the scroll indicators
                 * 2.
                 */
                const c = el[0];
                let av = attr.fpInifiniteScroll;
                let scrollDistance = null;
                const windowElement = angular.element($window);
                let container = windowElement;
                // get container height
                //


                function defaultHandler() {
                    console.log('scrolling')
                    let containerBottom;
                    let elementBottom;

                    if (container === windowElement) {
                        console.log('heightContainer', height(container));
                        console.log('pageYOffset(container[0].document.documentElement)',
                         pageYOffset(container[0].document.documentElement));
                        containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
                        elementBottom = offsetTop(el) + height(el);
                    }

                    const remaining = elementBottom - containerBottom;
                    console.log('remaining', remaining);
                    console.log('elementBottom', elementBottom);
                    console.log('constainerBottom', containerBottom);
                    const shouldScroll = remaining <= (height(container) * scrollDistance) + 1;
                    // console.log('shouldScroll 1', ((height(container) * scrollDistance) + 1));
                    console.log('shouldScroll', shouldScroll);

                    if (shouldScroll) {
                        // checkWhenEnabled = true;
                        scope.$apply(attr.fpInifiniteScroll);
                        // if (undefined) {
                        //     if (scope.$$phase) {
                        //         // scope.infiniteScroll();
                        //     } else {
                        //         console.log('hello from shouldScroll');
                        //
                        //     }
                        // }

                    }
                }

                    function offsetTop(element) {
                        if (!(!element[0].getBoundingClientRect || element.css('none'))) {
                            return element[0].getBoundingClientRect().top + pageYOffset(element);
                        }
                        return undefined;
                    }
                    container.on('scroll', defaultHandler);

                    // windowElement


                    // console.log('attr value', av);
                    var b = $document[0];

                    var d = angular.element(b);
                    var fb = d.find('#feed-bottom');
                    var fc = b.querySelector('.feed-container');
                    var containerTopOffset = fc.getBoundingClientRect().top;
                    var elHeight = c.offsetHeight;
                    var elOffsetTop = c.getBoundingClientRect().top;

                    function height(element) {
                        const el = element[0] || element;

                        if (isNaN(el.offsetHeight)) {
                            return el.document.documentElement.clientHeight;
                        }
                        return el.offsetHeight;
                    }

                    function pageYOffset(element) {
                        const el = element[0] || element;

                        if (isNaN(window.pageYOffset)) {
                            return el.document.documentElement.scrollTop;
                        }
                        return el.ownerDocument.defaultView.pageYOffset;
                    }

                    $timeout(() => {
                        let containerBottom;
                        console.log('hello');
                        // window as container
                        // console.log('container window', container);
                        console.log('height container', height(container));
                        containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
                        console.log('containerBottom', containerBottom);

                        // console.log('message', value);
                        // console.log('container.document.doecumentElement.clientHeight',
                        // container.document.documentElement.clientHeight);


                        // console.log('d', b.querySelector('.feed-container'));
                        // console.log('c.offsetHeight', c.offsetHeight);
                        // console.log('fc.height', fc.offsetHeight);
                        // console.log('fc.offest top', fc.getBoundingClientRect().top);
                        // console.log('elHeight', c.offsetHeight);
                        // console.log('elOffsetTop', elOffsetTop);
                        // console.log('el', c);

                        // console.log('c.ownerDocument.defaultView.pageYOffset',
                        //  c.ownerDocument.defaultView.pageYOffset);
                    }, 1000);

                    // console.log('b', b);
                    // console.log('b.innerHeight', b.innerHeight);
                    // console.log('b.scrollHeight', b.scrollHeight);
                    // console.log('b.offsetHeight', b.offsetHeight);
                    // console.log('b.scrollTop', b.scrollTop);

                    //
                    // $document.on('scroll', () => {
                    //
                    //     if (b.scrollTop + 400 = fb.position().top) {
                    //         console.log('content loading');
                    //     }
                    // console.log('document on scroll event');
                    // // console.log('b.scrollTop', b.scrollTop);
                    // console.log('fb.position top', fb.position().top);
                    // console.log('el outerHeight', el.innerHeight());
                    // console.log('el.offset().top', el.offset().top);
                    // console.log('window.pageYOffset', $window.pageYOffset);
                    // });

                    // $window.addEventListener('scroll', () => {
                    //
                    //     console.log('w.scrollTop', $window.scrollY);
                    //     console.log('w.scrollHeight', $window.innerHeight);
                    // //   console.log('el.scrollHeight', c.scrollHeight);
                    // // console.log('el.offsetHeight',  c.offsetHeight);
                    // // console.log('el.scrollTop', c.scrollTop);
                    //         if ($window.scrollY === (.75 * c.scrollHeight)) {
                    //             console.log('hello');
                    //             console.log('av', av);
                    //             scope.$apply(av);
                    //         }
                    //
                    //     });


                    // console.log('el', el);
                }

            };
        }
    }
