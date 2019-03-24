var http = require("http");
var fs = require("fs");
// 客户端的res
var clientRes = [];
 
var server = http.createServer();
// 客户端请求
server.on("request",function(req,res){
    if(req.url == "/"){
        fs.readFile(__dirname + '/comet.html', function(err, data){
            if(err) {
                res.writeHead(err, data);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
        return;
    }
    if(req.url == "/fetching"){
        clientRes.push(res);
        // 设置超时为10分钟
        res.setTimeout(10*60000);
        console.log(req.url);
        console.log("online ：",clientRes.length);
        return;
    }
    if(req.url == "/chat"){
        var body = "";
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var msg = body.split("=")[1];
            sendMsg(msg);
            res.end("ok");
        });
        return;
    }
    res.end("no page");
});
server.listen(8888);
 
// 发消息
function sendMsg(msgStr){
    clientRes.forEach(function(ele){
        ele.end(msgStr);
    });
    clientRes = [];
}
