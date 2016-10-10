const Koa = require('koa');
const WebSocket = require('ws');
const url = require('url');
const nunjucks = require('nunjucks');
const views = require('koa-views');
const Cookies = require('cookies');
const convert = require('koa-convert');
const bodyparser = require('koa-bodyparser')();


// 引用Server类:
const WebSocketServer = WebSocket.Server;

const app = new Koa();

app.use(convert(bodyparser));
app.use(convert(require('koa-static')(`${__dirname}/public`)));
app.use(views(`${__dirname}/views`, {
    map: {
        html: 'swig'
    }
}));

// log request URL:
app.use(async (ctx, next) => {
    if (ctx.request.path === '/') {
        // ctx.state.user = (new Date()).valueOf();
        app.wss.clients.forEach(function each(client) {
            client.send(createMessage({msg: (new Date()).valueOf().toString()+'上线了！', type: 'msg'}));
        });
        await ctx.render('index.html');
    } else {
        await next();
    }
});
function createMessage(obj) { 
    return JSON.stringify(obj)
}
function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
    let wss = new WebSocketServer({
        server: server
    });
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    onConnection = onConnection || function () {
        console.log('[WebSocket] connected.');
    };
    onMessage = onMessage || function (message) {
        if (message) {
            wss.broadcast(message);
        }
    };
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed: ${code} - ${message}`);
    };
    onError = onError || function (err) {
        console.log('[WebSocket] error: ' + err);
    };
    wss.on('connection', function (ws) {
        let location = url.parse(ws.upgradeReq.url, true);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        if (location.pathname !== '/ws/chat') {
            // close ws:
            ws.close(4000, 'Invalid URL');
        }
        // check user:
        // let user = parseUser(ws.upgradeReq);
        // if (!user) {
        //     ws.close(4001, 'Invalid user');
        // }
        // ws.user = user;
        // ws.wss = wss;
        onConnection.apply(ws);
    });
    console.log('WebSocketServer was attached.');
    return wss;
}

let server = app.listen(3000);

app.wss = createWebSocketServer(server, null, null, null);
console.log('app started at port 3000...');