var vdomLive = require('vdom-live');

var Server = require('__server');

vdomLive(function (renderLive, h) {
    var server = new Server();

    document.body.appendChild(renderLive(function () {
        return h('div', [
            'Hey!'
        ]);
    }));
});
