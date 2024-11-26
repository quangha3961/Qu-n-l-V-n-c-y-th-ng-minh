const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');
const mqtt = require('mqtt');
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Only allow requests from localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// MySQL database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "garden_smartdb"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

// WebSocket setup
const wss = new WebSocket.Server({ port: 8080 });
let clients = []; // Array to hold active WebSocket clients

// MQTT Broker connection
const mqtt_server = "mqtt://172.20.10.3"; // MQTT Broker IP
const mqtt_port = 1883; // Default MQTT port
const client = mqtt.connect(mqtt_server, { port: mqtt_port, clientId: "NodeJSClient" });
const topics = ["sensor/temp", "sensor/rain", "sensor/soil", "sensor/light","sensor/oncovering","sensor/onheating","sensor/onwatering"]; // MQTT topics

// Sensor data object to store incoming data
let sensorData = {
    temperature: null,
    humidity: null,
    lighting: null,
    raining: null,
    timestamp: Date.now(),
};

// Flag to track whether all sensor data has been received
let dataReceived = { temperature: false, humidity: false, lighting: false, raining: false };

// Connect to MQTT Broker and subscribe to topics
client.on('connect', () => {
    console.log("Connected to MQTT Broker!");
    client.subscribe(topics, (err) => {
        if (err) {
            console.error("Failed to subscribe to topics:", err);
        } else {
            console.log("Successfully subscribed to topics:", topics);
        }
    });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
    const messageString = message.toString();
    console.log(`Received data from topic "${topic}": ${messageString}`);

    let action_type = messageString === "1" ? "on" : "off"; // Chuyển đổi "on" và "off" thành chuỗi
    let device = "";

    if (String(topic) === "sensor/onheating") {
        device = "heating";
    } else if (String(topic) === "sensor/oncovering") {
        device = "covering";
    } else if (String(topic) === "sensor/onwatering") {
        device = "watering";
    }

    // Nếu có thông điệp hợp lệ, lưu vào cơ sở dữ liệu
    if (device) {
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " "); // Tạo timestamp dưới dạng yyyy-mm-dd hh:mm:ss

        // Câu lệnh SQL để chèn hành động vào cơ sở dữ liệu
        const query = "INSERT INTO action_history (action_type, device, timestamp) VALUES (?, ?, NOW())";
        const values = [action_type, device];

        db.query(query, values, (err, results) => {
            if (err) {
                console.error("Error saving action to database:", err);
            } else {
                console.log(`Action saved: ${action_type} for device: ${device} at ${timestamp}`);
            }
        });
    }
    switch (topic) {
        case "sensor/temp":
            sensorData.temperature = parseFloat(messageString);
            dataReceived.temperature = true;
            break;
        case "sensor/rain":
            sensorData.raining = parseInt(messageString);
            dataReceived.raining = true;
            break;
        case "sensor/soil":
            sensorData.humidity = parseInt(messageString);
            dataReceived.humidity = true;
            break;
        case "sensor/light":
            sensorData.lighting = parseInt(messageString);
            dataReceived.lighting = true;
            break;
        default:
            console.log(`Unknown topic: ${topic}`);
    }

    // Once all data is received, update the timestamp and send to WebSocket clients
    if (dataReceived.temperature && dataReceived.humidity && dataReceived.lighting && dataReceived.raining) {
        sensorData.timestamp = Date.now();

        // Send updated sensor data to all connected WebSocket clients
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(sensorData));
            }
        });

        // Insert data into MySQL database
        const query = `INSERT INTO sensor_data (temperature, humidity, lighting, raining, timestamp) VALUES (?, ?, ?, ?, ?)`;
        const values = [
            sensorData.temperature,
            sensorData.humidity,
            sensorData.lighting,
            sensorData.raining,
            sensorData.timestamp,
        ];

        db.query(query, values, (err, results) => {
            if (err) {
                console.error("Error saving data to database:", err);
            } else {
                console.log("Data saved successfully:", sensorData);
            }
        });
        
        // Reset flags for the next data cycle
        dataReceived = { temperature: false, humidity: false, lighting: false, raining: false };
    }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('A client connected to the WebSocket server');
    clients.push(ws);

    // Send the latest sensor data to the client when they connect
    if (sensorData.temperature && sensorData.humidity && sensorData.lighting && sensorData.raining) {
        ws.send(JSON.stringify(sensorData));
    }
    ws.on("message", (message) => {
        console.log("Received message:", message);

        try {
            // Parse dữ liệu JSON từ client
            const data = JSON.parse(message);

            // In ra các thông tin từ message
            if (data.deviceId && data.state) {
                console.log(`Device ID: ${data.deviceId}, State: ${data.state}`);
                if(data.deviceId ==="heating" ){
                    if(data.state==="on"){
                        client.publish(`/topic/heating/state`, "on");   
                    }else{
                        client.publish(`/topic/heating/state`, "off");
                    }
                }
                if(data.deviceId ==="covering" ){
                    if(data.state==="on"){
                        client.publish(`/topic/covering/state`, "on");   
                    }else{
                        client.publish(`/topic/covering/state`, "off");
                    }
                }
                if(data.deviceId ==="watering" ){
                    if(data.state==="on"){
                        client.publish(`/topic/watering/state`, "on");   
                    }else{
                        client.publish(`/topic/watering/state`, "off");
                    }
                }
            } else {
                console.log("Invalid message format:", message);
            }
        } catch (err) {
            console.error("Invalid JSON message:", err.message);
        }
    });
    // Handle WebSocket disconnections
    ws.on('close', () => {
        console.log('A client disconnected');
        clients = clients.filter(client => client !== ws);
    });

    // Handle WebSocket errors
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

// JWT authentication middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.userId = decoded.id;  // Attach the user ID to the request
        next();
    });
};

// Login route
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) throw err;

        if (results.length === 0 || results[0].password !== password) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: "1h" });
        res.json({ token });
    });
});

// API route protected by JWT authentication
app.get('/api/sensors', verifyToken, (req, res) => {
    res.json(sensorData);
});

// API route to fetch sensor history
app.get("/api/sensor/history", (req, res) => {
    // Query the database to get historical sensor data
    const query = "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 100"; // Limit to the 100 most recent records

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json({ message: "Unable to fetch historical data" });
        }

        // Return data in JSON format
        res.json({
            data: results.map((row) => ({
                timestamp: row.timestamp,
                temperature: row.temperature,
                humidity: row.humidity,
                lighting: row.lighting,
                raining: row.raining,
            })),
        });
    });
});

app.get("/api/actions/history", (req, res) => {
    // Query the database to get historical action data
    const query = "SELECT * FROM action_history ORDER BY timestamp ASC LIMIT 100"; // Get the 100 most recent records

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json({ message: "Unable to fetch action history" });
        }

        // Return action history in JSON format
        res.json({
            data: results.map((row) => ({
                timestamp: row.timestamp,
                actionType: row.action_type,  // action_type as 0 or 1
                deviceId: row.device,         // device name like heating, watering, covering
            })),
        });
    });
});

// Start Express server
app.listen(5000, () => console.log("Server running on port 5000"));
