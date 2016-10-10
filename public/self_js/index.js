; (() => {
    var ws = new WebSocket('wss://lddgame.herokuapp.com/ws/chat');
    // var ws = new WebSocket('ws://localhost:3000/ws/chat');
    ws.onmessage = function (event) {
        var data = event.data;
        var msg = JSON.parse(data);
        // console.log(msg);
        if (msg.type == 'msg') {
            console.log(msg.msg);
        } else {
            if (!canvas.begin) { 
                if (msg.isbegin) {
                    canvas.ctx.moveTo(msg.x, msg.y);
                } else { 
                    canvas.ctx.lineTo(msg.x, msg.y);
                    canvas.ctx.stroke();
                    canvas.ctx.moveTo(msg.x, msg.y);
                }
            }
        }

    };
    ws.onclose = function (evt) {
        console.log(evt);
        console.log('[closed] ' + evt.code);
    };
    ws.onerror = function (code, msg) {
        console.log('[ERROR] ' + code + ': ' + msg);
    };
    var canvas = {
        c: document.getElementById("canvas"),
        ctx: null,
        init: () => {
            canvas.c.width = canvas.c.clientWidth;
            canvas.c.height = canvas.c.clientHeight;
            canvas.ctx = canvas.c.getContext("2d");
            canvas.binds();
        },
        binds: () => {
            var _ = canvas;
            $(_.c).on('touchstart', (e) => {
                var point = {
                    x: e.originalEvent.changedTouches[0].clientX,
                    y: e.originalEvent.changedTouches[0].clientY,
                    isbegin: true
                };
                _.ctx.moveTo(point.x, point.y);
                ws.send(JSON.stringify(point));
            }).on('touchmove', (e) => {
                e.preventDefault();
                _.begin = true;
                var point = {
                    x: e.originalEvent.changedTouches[0].clientX,
                    y: e.originalEvent.changedTouches[0].clientY,
                    isbegin: false
                };
                ws.send(JSON.stringify(point));
                _.ctx.lineTo(point.x, point.y);
                _.ctx.stroke();
                _.ctx.moveTo(point.x, point.y);
            }).on('touchend', (e) => { 
                // _.begin = false;
            })
        }
    };
    canvas.init();
})();