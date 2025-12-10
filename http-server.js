const http = require('http');
const fs = require('fs');
const path = require('path');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 设置响应头
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // 读取并返回HTML文件
    const filePath = path.join(__dirname, '五子棋.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.end('服务器错误');
            return;
        }
        
        res.statusCode = 200;
        res.end(data);
    });
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`HTTP服务器已启动，访问地址：http://localhost:${PORT}`);
});
