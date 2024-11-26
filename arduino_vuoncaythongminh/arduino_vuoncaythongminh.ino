#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// Thông tin mạng WiFi
const char* ssid = "Hà"; // Thay bằng tên Wi-Fi của bạn
const char* password = "1234567890"; // Thay bằng mật khẩu Wi-Fi của bạn

// Thông tin Mosquitto MQTT Broker
const char* mqtt_server = "172.20.10.3"; // Địa chỉ IP của máy tính chạy Mosquitto
const int mqtt_port = 1883; // Cổng MQTT mặc định

WiFiClient espClient;
PubSubClient client(espClient);

const int rainAnalogPin = 32;   // Chân analog trên ESP32
const int rainDigitalPin = 25;  // Chân digital trên ESP32

const int soilAnalogPin = 35;   // Chân analog của cảm biến độ ẩm đất
const int soilDigitalPin = 26;  // Chân digital của cảm biến độ ẩm đất

const int lightAnalogPin = 33;  // Chân analog của cảm biến ánh sáng

#define DHTPIN 27     // Chọn chân Data của DHT11
#define DHTTYPE DHT11  // Sử dụng cảm biến DHT11

DHT dht(DHTPIN, DHTTYPE);

const int ledPin1 = 12; // Điều khiển thiết bị "heating"
const int ledPin2 = 13; // Điều khiển thiết bị "covering"
const int ledPin3 = 14; // Điều khiển thiết bị "watering"

unsigned long previousMillis = 0;
const long interval = 3000; // Thời gian gửi dữ liệu MQTT

// Kết nối WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Đang kết nối tới WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi đã kết nối.");
}

// Kết nối lại MQTT nếu mất kết nối
void reconnect() {
  while (!client.connected()) {
    Serial.print("Đang kết nối tới MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Kết nối thành công!");

      // Đăng ký các topic điều khiển thiết bị
      client.subscribe("/topic/heating/state");
      client.subscribe("/topic/covering/state");
      client.subscribe("/topic/watering/state");

      Serial.println("Đã đăng ký các topic điều khiển!");
    } else {
      Serial.print("Thất bại, lỗi = ");
      Serial.print(client.state());
      Serial.println(" Thử lại sau 5 giây...");
      delay(5000);
    }
  }
}

// Hàm xử lý MQTT callback
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  // In thông tin nhận được từ MQTT
  Serial.print("Received on topic: ");
  Serial.print(topic);
  Serial.print(", Message: ");
  Serial.println(message);

  // Xử lý từng thiết bị theo topic
  if (String(topic) == "/topic/heating/state") {
    if (message == "on") {
      digitalWrite(ledPin1, HIGH); // Bật thiết bị heating
      client.publish("sensor/onheating", String(1).c_str());
      Serial.println("Heating ON");
    } else if (message == "off") {
      digitalWrite(ledPin1, LOW); // Tắt thiết bị heating
      client.publish("sensor/onheating", String(0).c_str());
      Serial.println("Heating OFF");
    }
  }

  if (String(topic) == "/topic/covering/state") {
    if (message == "on") {
      digitalWrite(ledPin2, HIGH); // Bật thiết bị covering
      client.publish("sensor/oncovering", String(1).c_str());
      Serial.println("Covering ON");
    } else if (message == "off") {
      digitalWrite(ledPin2, LOW); // Tắt thiết bị covering
      client.publish("sensor/oncovering", String(0).c_str());
      Serial.println("Covering OFF");
    }
  }

  if (String(topic) == "/topic/watering/state") {
    if (message == "on") {
      digitalWrite(ledPin3, HIGH); // Bật thiết bị watering
      client.publish("sensor/onwatering", String(1).c_str());
      Serial.println("Watering ON");
    } else if (message == "off") {
      digitalWrite(ledPin3, LOW); // Tắt thiết bị watering
      client.publish("sensor/onwatering", String(0).c_str());
      Serial.println("Watering OFF");
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  dht.begin();

  // Cấu hình chân cảm biến
  pinMode(rainAnalogPin, INPUT);
  pinMode(rainDigitalPin, INPUT);
  pinMode(soilAnalogPin, INPUT);
  pinMode(soilDigitalPin, INPUT);
  pinMode(lightAnalogPin, INPUT);

  // Cấu hình chân điều khiển thiết bị
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);

  // Cấu hình MQTT server và callback
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  // Đảm bảo kết nối MQTT
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Đọc dữ liệu từ cảm biến
  int rainAnalogValue = 4095 - analogRead(rainAnalogPin);
  int soilAnalogValue = 4095 - analogRead(soilAnalogPin);
  int lightAnalogValue = 4095 - analogRead(lightAnalogPin);

  int rainPercent = map(rainAnalogValue, 0, 4095, 0, 100);
  int soilPercent = map(soilAnalogValue, 0, 4095, 0, 100);
  int lightPercent = map(lightAnalogValue, 0, 4095, 0, 100);

  float temperature = dht.readTemperature();

  // In kết quả ra Serial
  Serial.print("Nhiệt độ: ");
  Serial.print(temperature);
  Serial.println(" °C");
  Serial.print("Mưa: ");
  Serial.print(rainPercent);
  Serial.println("%");
  Serial.print("Độ ẩm đất: ");
  Serial.print(soilPercent);
  Serial.println("%");
  Serial.print("Độ sáng: ");
  Serial.print(lightPercent);
  Serial.println("%");

  // Gửi dữ liệu lên MQTT
  client.publish("sensor/temp", String(temperature).c_str());
  client.publish("sensor/rain", String(rainPercent).c_str());
  client.publish("sensor/soil", String(soilPercent).c_str());
  client.publish("sensor/light", String(lightPercent).c_str());

  delay(interval); // Chờ trước khi gửi dữ liệu tiếp theo
}
