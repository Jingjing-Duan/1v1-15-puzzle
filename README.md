The lab's send_to_event_hubs() function creates a new EventHubProducerClient for every request. In a production system handling 10,000 requests/second, what is the primary problem with this approach?
Question 15 options:

Each client instance consumes a separate partition, quickly exhausting all available partitions in the Event Hub


Multiple producer clients cannot write to the same Event Hub simultaneously due to locking


Repeated AMQP and TLS handshakes cause high latency and connection exhaustion


Azure charges per client instance created, making this approach prohibitively expensive at scale

----------------------------
System Responsibilities
Frontend
Render the UI
Run local puzzle logic
Show opponent progress
Send player progress updates
Receive room/game state updates
Lobby Service
Create room
Join room
Mark player as ready
Enforce 2-player room limit
Trigger game start
SpacetimeDB
Store room state
Store player ready state
Store progress
Store finished state
Store winner
Broadcast updates in real time


1. Frontend UI + Cloud Hosting

这个人负责：

游戏页面
board UI
result / progress UI
把前端部署到 Azure Static Web Apps 或 App Service

👉 这样他也有云的部分：frontend deployment

2. Puzzle Logic + Cloud Integration

这个人负责：

shuffle
move rules
win check
把游戏逻辑和云端同步的数据接起来

比如：

本地 progress 怎么发到云端
完成状态怎么提交到云端

👉 云的部分：client-cloud integration

3. SpacetimeDB / Realtime

这个人负责：

schema
subscriptions
player state sync
game state replication

👉 这是最明显的云部分：realtime cloud backend

4. Lobby / Matchmaking Service

这个人负责：

create game
join game
room management
把服务部署到 Azure

👉 云的部分：backend microservice deployment

5. Leaderboard / Results / Storage

这个人负责：

leaderboard
score validation
result/history storage
接 cloud database

比如：

Azure SQL / Cosmos DB / PostgreSQL

👉 云的部分：cloud database + result service


