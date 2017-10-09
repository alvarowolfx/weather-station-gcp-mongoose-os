load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_dht.js');

let led = Cfg.get('pins.led');
let button = Cfg.get('pins.button');
let topic = '/devices/' + Cfg.get('device.id') + '/events';

print('LED GPIO:', led, 'button GPIO:', button);

let dht = DHT.create(23, DHT.DHT11);

let getInfo = function() {
  return JSON.stringify({
    total_ram: Sys.total_ram(),
    free_ram: Sys.free_ram(),
    temp: dht.getTemp(),
    hum: dht.getHumidity()
  });
};

// Blink built-in LED every second
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
Timer.set(
  1000 /* 1 sec */,
  true /* repeat */,
  function() {
    let value = GPIO.toggle(led);
    print(value ? 'Tick' : 'Tock', 'uptime:', Sys.uptime(), getInfo());
  },
  null
);

// Publish to MQTT topic on a button press. Button is wired to GPIO pin 0
GPIO.set_button_handler(
  button,
  GPIO.PULL_UP,
  GPIO.INT_EDGE_NEG,
  200,
  function() {
    let message = getInfo();
    let ok = MQTT.pub(topic, message, 1);
    print('Published:', ok, topic, '->', message);
  },
  null
);

// Monitor network connectivity.
Net.setStatusEventHandler(function(ev, arg) {
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = 'DISCONNECTED';
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = 'CONNECTED';
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
  }
  print('== Net event:', ev, evs);
}, null);
