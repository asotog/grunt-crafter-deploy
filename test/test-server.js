var http = require('http');
/* mock server for crafter deploy task tests */
console.info('STARTING:  mock server for crafter deploy task tests');

http.createServer(function (req, res) {
    var url = req.url;
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    
    if (url.indexOf('/alfresco/service/api/login') > -1) {
        console.info('REQUEST: /alfresco/service/api/login')
        res.write('<ticket>TICKET_ID</ticket>');
    } else if (url.indexOf('/alfresco/s/cstudio/wcm/content/upload-content-asset') > -1 ) {
        console.info('REQUEST: /alfresco/s/cstudio/wcm/content/upload-content-asset');
        res.write('It works!');    
    }
    
    res.end();
}).listen(9615);