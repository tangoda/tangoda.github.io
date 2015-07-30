(function(){
  'use strict';

  var itemAtual = {};

  $(document).on('pageinit', '#detalhe-hospital', function() {
    $('.item-name', this).text(itemAtual.name);
    $('.item-location', this).text(itemAtual.location);
    $('.item-desc', this).text(itemAtual.desc);
  });

  $(document).on('pageinit', '#lista-hospitais', function() {
    $('.list-item-container', this).on('click', function() {
      itemAtual = {
        name : $('.name', this).text(),
        location : $('.location', this).text(),
        desc : $('.desc', this).text()
      };

      app.navi.pushPage('detalhe-hospital.html');
    });
  });

})();