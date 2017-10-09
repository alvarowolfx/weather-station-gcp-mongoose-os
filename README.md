### Create IoT Core resources



### Upload firmware

`mos build --arch esp32`
`mos flash`

### Provision 

`mos wifi your_ssid your_pass`
`mos gcp-iot-setup --gcp-project your_project --gcp-region us-central1 --gcp-registry your_registry`

### Setup BigQuery Dataset and Table



### Setup Firebase

`firebase init`
`firebase functions:config:set bigquery.datasetname="bar" bigquery.tablename="baz"`
`firebase deploy --only functions`