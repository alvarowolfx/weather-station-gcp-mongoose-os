mos build --arch esp32
mos flash
mos wifi 'casa viebrantz' alvaro.felipe
mos gcp-iot-setup --gcp-project weather-station-iot-170004 --gcp-region us-central1 --gcp-registry weather-station-registry
