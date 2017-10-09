const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bigquery = require('@google-cloud/bigquery')();

admin.initializeApp(functions.config().firebase);

const db = admin.database();

/**
 * Receive data from pubsub, then 
 * Write telemetry raw data to bigquery
 * Maintain last data on firebase realtime database
 */
exports.receiveTelemetry = functions.pubsub
  .topic('telemetry-topic')
  .onPublish(event => {
    const attributes = event.data.attributes;
    const message = event.data.json;

    const deviceId = attributes['deviceId'];

    const data = {
      humidity: message.hum,
      temp: message.temp,
      deviceId: deviceId,
      timestamp: event.timestamp
    };

    return Promise.all([
      insertIntoBigquery(data),
      updateCurrentDataFirebase(data)
    ]);
  });

/** 
 * Maintain last status in firebase
*/
function updateCurrentDataFirebase(data) {
  return db.ref(`/devices/${data.deviceId}`).set({
    humidity: data.humidity,
    temp: data.temp,
    lastTimestamp: data.timestamp
  });
}

/**
 * Store all the raw data in bigquery
 */
function insertIntoBigquery(data) {
  // TODO: Make sure you set the `bigquery.datasetname` Google Cloud environment variable.
  const dataset = bigquery.dataset(functions.config().bigquery.datasetname);
  // TODO: Make sure you set the `bigquery.tablename` Google Cloud environment variable.
  const table = dataset.table(functions.config().bigquery.tablename);

  return table.insert(data);
}

/*
const Firestore = require('@google-cloud/firestore');

const db = new Firestore();
const telemetryRef = db.collection('telemetry');

exports.receiveTelemetry = functions.pubsub
  .topic('telemetry-topic')
  .onPublish(event => {
    console.log(event);

    const message = event.data.json;

    return telemetryRef.add({
      humidity: message.hum,
      temperature: message.temp,
      deviceId: event.data.attributes['deviceId'],
      timestamp: event.timestamp
    });
  });
*/
