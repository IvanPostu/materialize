function loadCSS(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }

  (function(){
    loadCSS('http://localhost:9001/bin/materialize.css')
  })();