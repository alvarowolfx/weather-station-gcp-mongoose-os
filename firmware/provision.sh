mos build --arch esp32
mos flash
mos wifi ssid password
mos gcp-iot-setup --gcp-project weather-station-iot-170004 --gcp-region us-central1 --gcp-registry weather-station-registry
