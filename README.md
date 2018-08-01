# Build a Weather station using Google Cloud IoT Core and Mongoose OS


WebApp: https://weather-station-iot-170004.firebaseapp.com

### Setup Google cloud tools and project

* Install beta components:
    * `gcloud components install beta`
* Authenticate with Google Cloud:
    * `gcloud auth login`
* Create cloud project — choose your unique project name:
    * `gcloud projects create YOUR_PROJECT_NAME`
* Set current project
    * `gcloud config set project YOUR_PROJECT_NAME`

### Create IoT Core resources

* Add permissions for IoT Core
    * `gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME --member=serviceAccount:cloud-iot@system.gserviceaccount.com --role=roles/pubsub.publisher`
* Create PubSub topic for device data:
    * `gcloud beta pubsub topics create telemetry-topic`
* Create PubSub subscription for device data:
    * `gcloud beta pubsub subscriptions create --topic telemetry-topic telemetry-subscription`
* Create device registry:
    * `gcloud beta iot registries create weather-station-registry --region us-central1 -event-notification-config=topic=projects/YOUR_PROJECT_NAME/topics/telemetry-topic`

### Upload firmware with Mongoose OS Tools

To use it we need to download and install it from the official website. Follow the installation instructions on https://mongoose-os.com/docs/quickstart/setup.html.

* `mos build --arch esp32` or `mos build --arch esp8266`
* `mos flash`

### Provision and config

* `mos wifi your_ssid your_pass`
* `mos gcp-iot-setup --gcp-project your_project --gcp-region us-central1 --gcp-registry your_registry`

### Setup BigQuery Dataset and Table

Here we will use it to store all of ours collected sensor data to run some queries and to build reports later using Data Studio. To start let’s create a Dataset and a Table store our data. To do this, open the BigQuery Web UI, and follow the instructions:

* Access [bigquery.cloud.google.com](https://bigquery.cloud.google.com)
* Click the down arrow icon and click on “Create new dataset”.
* Name you Dataset “weather_station_iot”.
* Create a Table “raw_data” with the following fields and types:
--- PUT IMAGE HERE ---

### Setup Firebase, deploy functions and webapp

* `npm install -g firebase-tools` or `yarn global add firebase-tools`
* `firebase init`
* `firebase functions:config:set bigquery.datasetname="weather_station_iot" bigquery.tablename="raw_data"` 
* `firebase deploy`
