angular.module('directives.scroll',[])/*.directive("scroll", function ($window) {
  return function(scope, element, attrs) {
    angular.element(document.querySelector('#scrollArea')).bind("scroll", function() {

      console.log();
      if (this.scrollHeight - this.scrollTop - this.clientHeight < 1) {
        element.addClass('min');
        console.log('Нужно догрузить элементы');
      } else {
        element.removeClass('min');
        console.log('Пока грузить ничего не нужно');
      }
    });
  };
});*/
