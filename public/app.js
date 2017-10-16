document.addEventListener('DOMContentLoaded', function() {
  const db = firebase.database();

  // Create listeners
  const devicesRef = db.ref('/devices');

  // Register functions that update with last devices state
  devicesRef.on('value', function(snapshot) {
    let devices = snapshot.val();
    console.log(devices);
    let devicesEl = document.getElementById('devices');
    devicesEl.innerHTML = '';

    for (var key in devices) {
      let deviceState = devices[key];
      let li = document.createElement('li');
      li.className = 'mdc-list-item';
      li.innerHTML = `
        <span class="mdc-list-item__start-detail grey-bg" role="presentation">
            <i class="material-icons" aria-hidden="true">cloud</i>
        </span>
        <span class="mdc-list-item__text">
            Station #${key}
            <span class="mdc-list-item__text__secondary">
                ${deviceState.temp} C°/${deviceState.humidity} %
            </span>
            <span class="mdc-list-item__text__secondary">
                Last updated: ${new Date(
                  deviceState.lastTimestamp
                ).toLocaleString()}
            </span>
        </span>
      `;

      devicesEl.appendChild(li);
    }
  });

  fetchReportData();
});

const reportDataUrl = '/getReportData';

function fetchReportData() {
  try {
    fetch(reportDataUrl)
      .then(res => res.json())
      .then(rows => {
        var maxTempData = rows.map(row => row.max_temp);
        var avgTempData = rows.map(row => row.avg_temp);
        var minTempData = rows.map(row => row.min_temp);

        var maxHumData = rows.map(row => row.max_hum);
        var avgHumData = rows.map(row => row.avg_hum);
        var minHumData = rows.map(row => row.min_hum);

        var labels = rows.map(row => row.data_hora.value);

        buildLineChart(
          'tempLineChart',
          'Temperature in C°',
          labels,
          '#E64D3D',
          avgTempData
        );
        buildLineChart(
          'humLineChart',
          'Humidity in %',
          labels,
          '#0393FA',
          avgHumData
        );
      });
  } catch (e) {
    alert('Error getting report data');
  }
}

// Constroi um gráfico de linha no elemento (el) com a descrição (label) e os
// dados passados (data)
function buildLineChart(el, label, labels, color, avgData) {
  const elNode = document.getElementById(el);
  new Chart(elNode, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: avgData,
          borderWidth: 1,
          fill: true,
          spanGaps: true,
          lineTension: 0.2,
          backgroundColor: color,
          borderColor: '#3A4250',
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [
          {
            type: 'time',
            distribution: 'series',
            ticks: {
              source: 'labels'
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: label
            },
            ticks: {
              stepSize: 0.5
            }
          }
        ]
      }
    }
  });

  const progressEl = document.getElementById(el + '_progress');
  progressEl.remove();
}
