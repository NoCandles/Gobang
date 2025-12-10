const WebSocket = require('ws');

// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 8080 });

// 房间管理
const rooms = new Map();

// 生成唯一房间ID
function generateRoomId() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

// 处理新连接
wss.on('connection', (ws) => {
    console.log('新客户端连接');
    
    // 客户端信息
    let clientInfo = {
        ws: ws,
        roomId: null,
        role: null
    };
    
    // 处理消息
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleMessage(clientInfo, data);
        } catch (error) {
            console.error('消息解析错误:', error);
        }
    });
    
    // 处理断开连接
    ws.on('close', () => {
        console.log('客户端断开连接');
        leaveRoom(clientInfo);
    });
    
    // 处理错误
    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
    });
});

// 处理客户端消息
function handleMessage(clientInfo, data) {
    const { ws } = clientInfo;
    
    switch (data.type) {
        case 'createRoom':
            createRoom(clientInfo);
            break;
            
        case 'joinRoom':
            joinRoom(clientInfo, data.roomId);
            break;
            
        case 'move':
            broadcastMove(clientInfo, data);
            break;
            
        case 'gameOver':
            broadcastGameOver(clientInfo, data);
            break;
            
        case 'reset':
            broadcastReset(clientInfo);
            break;
            
        default:
            console.log('未知消息类型:', data.type);
    }
}

// 创建房间
function createRoom(clientInfo) {
    const roomId = generateRoomId();
    
    // 创建新房间
    rooms.set(roomId, {
        host: clientInfo,
        guest: null,
        isFull: false
    });
    
    // 更新客户端信息
    clientInfo.roomId = roomId;
    clientInfo.role = 'host';
    
    // 发送房间创建成功消息
    clientInfo.ws.send(JSON.stringify({
        type: 'roomCreated',
        roomId: roomId
    }));
    
    console.log(`房间创建成功: ${roomId}`);
}

// 加入房间
function joinRoom(clientInfo, roomId) {
    const room = rooms.get(roomId);
    
    if (!room) {
        clientInfo.ws.send(JSON.stringify({
            type: 'roomNotFound',
            message: '房间不存在'
        }));
        return;
    }
    
    if (room.isFull) {
        clientInfo.ws.send(JSON.stringify({
            type: 'roomFull',
            message: '房间已满'
        }));
        return;
    }
    
    // 设置为guest
    room.guest = clientInfo;
    room.isFull = true;
    
    // 更新客户端信息
    clientInfo.roomId = roomId;
    clientInfo.role = 'guest';
    
    // 发送加入房间成功消息
    clientInfo.ws.send(JSON.stringify({
        type: 'roomJoined',
        roomId: roomId
    }));
    
    // 通知房主有玩家加入
    if (room.host && room.host.ws.readyState === WebSocket.OPEN) {
        room.host.ws.send(JSON.stringify({
            type: 'opponentConnected',
            message: '对手已连接'
        }));
    }
    
    console.log(`玩家加入房间: ${roomId}`);
}

// 离开房间
function leaveRoom(clientInfo) {
    const { roomId, role } = clientInfo;
    
    if (!roomId) return;
    
    const room = rooms.get(roomId);
    if (!room) return;
    
    // 移除客户端
    if (role === 'host') {
        // 如果房主离开，关闭房间
        if (room.guest && room.guest.ws.readyState === WebSocket.OPEN) {
            room.guest.ws.send(JSON.stringify({
                type: 'roomClosed',
                message: '房主已离开，房间已关闭'
            }));
        }
        rooms.delete(roomId);
    } else {
        // 如果guest离开，更新房间状态
        room.guest = null;
        room.isFull = false;
        
        if (room.host && room.host.ws.readyState === WebSocket.OPEN) {
            room.host.ws.send(JSON.stringify({
                type: 'opponentLeft',
                message: '对手已离开'
            }));
        }
    }
    
    console.log(`玩家离开房间: ${roomId}`);
}

// 广播落子信息
function broadcastMove(clientInfo, data) {
    const { roomId, role } = clientInfo;
    
    if (!roomId) return;
    
    const room = rooms.get(roomId);
    if (!room) return;
    
    // 发送给对手
    const opponent = role === 'host' ? room.guest : room.host;
    if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
        opponent.ws.send(JSON.stringify({
            type: 'move',
            row: data.row,
            col: data.col,
            player: data.player
        }));
    }
}

// 广播游戏结束
function broadcastGameOver(clientInfo, data) {
    const { roomId, role } = clientInfo;
    
    if (!roomId) return;
    
    const room = rooms.get(roomId);
    if (!room) return;
    
    // 发送给对手
    const opponent = role === 'host' ? room.guest : room.host;
    if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
        opponent.ws.send(JSON.stringify({
            type: 'gameOver',
            winner: data.winner
        }));
    }
}

// 广播重置游戏
function broadcastReset(clientInfo) {
    const { roomId, role } = clientInfo;
    
    if (!roomId) return;
    
    const room = rooms.get(roomId);
    if (!room) return;
    
    // 发送给对手
    const opponent = role === 'host' ? room.guest : room.host;
    if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
        opponent.ws.send(JSON.stringify({
            type: 'reset'
        }));
    }
}

console.log('WebSocket服务器已启动，监听端口8080');
