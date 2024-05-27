var modalData = [];

function replaceModalContent(data) {
  document.getElementById("whois-data").innerHTML = modalData[data];
}
document.getElementById('submitButton').addEventListener('click', function () {
  let urlTextArea = document.getElementById('urlTextArea').value;
  document.getElementById('resultsDiv').style.display = 'none';

  var btn = document.getElementById('submitButton');
  btn.disabled = true;

  if (urlTextArea == "") {
    btn.disabled = false;
    return;
  }

  function plain2html(text) {
    text = (text || "");
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\t/g, "    ")
      .replace(/ /g, "&#8203;&nbsp;&#8203;")
      .replace(/\r\n|\r|\n/g, "<br />")
      .replace(/\'/g, "\\\'")
      .replace(/\"/g, "\\\"")
      .replace(/\(/g, "\\\(")
      .replace(/\)/g, "\\\)");
  }

  function rainbow(numOfSteps, step) {
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch (i % 6) {
      case 0: r = 1; g = f; b = 0; break;
      case 1: r = q; g = 1; b = 0; break;
      case 2: r = 0; g = 1; b = f; break;
      case 3: r = 0; g = q; b = 1; break;
      case 4: r = f; g = 0; b = 1; break;
      case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
  }

  document.getElementById('loading-spinner').style.display = 'flex';
  fetch('/process', {
    //fetch('http://localhost:3000/process', {
    method: "POST",
    mode: "cors",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ urlTextArea: urlTextArea })
  })
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        let table = new DataTable('#results-table');
        table.destroy();
        var temp = "";

        var status100 = status101 = status102 = status103 = 0;
        var status200 = status201 = status202 = status203 = status205 = status206 = status207 = status208 = status226 = 0;
        var status300 = status301 = status302 = status303 = status304 = status305 = status306 = status307 = status308 = 0;
        var status400 = status401 = status402 = status403 = status404 = status405 = status406 = status407 = status408 = 0;
        var status409 = status410 = status411 = status412 = status413 = status414 = status415 = status416 = status417 = 0;
        var status418 = status421 = status422 = status423 = status424 = status425 = status426 = status428 = status429 = 0;
        var status431 = status451 = 0;
        var status500 = status501 = status502 = status503 = status504 = status505 = status506 = status507 = status508 = status510 = status511 = 0;
        data.forEach((itemData) => {
          let whoisContent = plain2html(itemData.whois);

          modalData[itemData.domain] = whoisContent;
          temp += "<tr>";
          temp += "<td>" + itemData.domain + "</td>";
          temp += "<td>" + itemData.status + "</td>";
          temp += `<td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#whoisModal" onclick="replaceModalContent('${itemData.domain}')" >WHOIS</button></td>`;

          switch (itemData.status) {
            case 100: status100++; break;
            case 101: status101++; break;
            case 102: status102++; break;
            case 103: status103++; break;

            case 200: status200++; break;
            case 201: status201++; break;
            case 202: status202++; break;
            case 203: status203++; break;
            case 205: status205++; break;
            case 206: status206++; break;
            case 207: status207++; break;
            case 208: status208++; break;
            case 226: status226++; break;

            case 300: status300++; break;
            case 301: status301++; break;
            case 302: status302++; break;
            case 303: status303++; break;
            case 304: status304++; break;
            case 305: status305++; break;
            case 306: status306++; break;
            case 307: status307++; break;
            case 308: status308++; break;

            case 400: status400++; break;
            case 401: status401++; break;
            case 402: status402++; break;
            case 403: status403++; break;
            case 404: status404++; break;
            case 405: status405++; break;
            case 406: status406++; break;
            case 407: status407++; break;
            case 408: status408++; break;

            case 409: status409++; break;
            case 410: status410++; break;
            case 411: status411++; break;
            case 412: status412++; break;
            case 413: status413++; break;
            case 414: status414++; break;
            case 415: status415++; break;
            case 416: status416++; break;
            case 417: status417++; break;

            case 418: status418++; break;
            case 421: status421++; break;
            case 422: status422++; break;
            case 423: status423++; break;
            case 424: status424++; break;
            case 425: status425++; break;
            case 426: status426++; break;
            case 428: status428++; break;
            case 429: status429++; break;

            case 431: status431++; break;
            case 451: status451++; break;

            case 500: status500++; break;
            case 501: status501++; break;
            case 502: status502++; break;
            case 503: status503++; break;
            case 504: status504++; break;
            case 505: status505++; break;
            case 506: status506++; break;
            case 507: status507++; break;
            case 508: status508++; break;
            case 510: status510++; break;
            case 511: status511++; break;
          }
        });
        document.getElementById('tableData').innerHTML = temp;
        document.getElementById('loading-spinner').style.display = 'none';
        document.getElementById('resultsDiv').style.display = '';

        table = new DataTable('#results-table', {
          paging: true,
          pageLength: 50,
          lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, 'All']
          ],
          layout: {
            topStart: {
              buttons: ['pageLength', 'copy', 'csv', 'excel', 'pdf', 'print']
            }
          },
          initComplete: function () {
            this.api()
              .columns()
              .every(function () {
                let column = this;

                // Create select element
                let select = document.createElement('select');
                select.style.width = "100%";
                select.add(new Option(''));
                column.footer().replaceChildren(select);

                // Apply listener for user change in value
                select.addEventListener('change', function () {
                  column
                    .search(select.value, { exact: true })
                    .draw();
                });

                // Add list of options
                column
                  .data()
                  .unique()
                  .sort()
                  .each(function (d, j) {
                    select.add(new Option(d));
                  });
              });
          }
        });

        if (window.doughnutChart !== undefined)
          window.doughnutChart.destroy();

        var chrt = document.getElementById("chartId").getContext("2d");

        let chartConfig = {
          type: 'doughnut',
          data: {
            labels: ["100", "101", "102", "103", "200", "201", "202", "203", "205", "206", "207", "208", "226", "300", "301", "302", "303", "304", "305", "306", "307", "308", "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "418", "421", "422", "423", "424", "425", "426", "428", "429", "431", "451", "500", "501", "502", "503", "504", "505", "506", "507", "508", "510", "511"],
            datasets: [{
              label: "Códigos de resposta",
              data: [status100,
                status101,
                status102,
                status103,
                status200,
                status201,
                status202,
                status203,
                status205,
                status206,
                status207,
                status208,
                status226,
                status300,
                status301,
                status302,
                status303,
                status304,
                status305,
                status306,
                status307,
                status308,
                status400,
                status401,
                status402,
                status403,
                status404,
                status405,
                status406,
                status407,
                status408,
                status409,
                status410,
                status411,
                status412,
                status413,
                status414,
                status415,
                status416,
                status417,
                status418,
                status421,
                status422,
                status423,
                status424,
                status425,
                status426,
                status428,
                status429,
                status431,
                status451,
                status500,
                status501,
                status502,
                status503,
                status504,
                status505,
                status506,
                status507,
                status508,
                status510,
                status511],
              backgroundColor: [rainbow(62, 1),
              rainbow(62, 2),
              rainbow(62, 3),
              rainbow(62, 4),
              rainbow(62, 5),
              rainbow(62, 6),
              rainbow(62, 7),
              rainbow(62, 8),
              rainbow(62, 9),
              rainbow(62, 10),
              rainbow(62, 11),
              rainbow(62, 12),
              rainbow(62, 13),
              rainbow(62, 14),
              rainbow(62, 15),
              rainbow(62, 16),
              rainbow(62, 17),
              rainbow(62, 18),
              rainbow(62, 19),
              rainbow(62, 20),
              rainbow(62, 21),
              rainbow(62, 22),
              rainbow(62, 23),
              rainbow(62, 24),
              rainbow(62, 25),
              rainbow(62, 26),
              rainbow(62, 27),
              rainbow(62, 28),
              rainbow(62, 29),
              rainbow(62, 30),
              rainbow(62, 31),
              rainbow(62, 32),
              rainbow(62, 33),
              rainbow(62, 34),
              rainbow(62, 35),
              rainbow(62, 36),
              rainbow(62, 37),
              rainbow(62, 38),
              rainbow(62, 39),
              rainbow(62, 40),
              rainbow(62, 41),
              rainbow(62, 42),
              rainbow(62, 43),
              rainbow(62, 44),
              rainbow(62, 45),
              rainbow(62, 46),
              rainbow(62, 47),
              rainbow(62, 48),
              rainbow(62, 49),
              rainbow(62, 50),
              rainbow(62, 51),
              rainbow(62, 52),
              rainbow(62, 53),
              rainbow(62, 54),
              rainbow(62, 55),
              rainbow(62, 56),
              rainbow(62, 57),
              rainbow(62, 58),
              rainbow(62, 59),
              rainbow(62, 60),
              rainbow(62, 61),
              rainbow(62, 62)],
              hoverOffset: 5
            }],
          },
          options: {
            responsive: false,
            plugins: {
              legend: {
                labels: {
                  filter: (legendItem, data) => {
                    return data.datasets[0].data[legendItem.index] != 0
                  }
                }
              },
            }
          },

        };
        window.doughnutChart = new Chart(chrt, chartConfig);
        //chartId.update(chartConfig);
      }
      btn.disabled = false;
    })
    .catch(error => {
      document.getElementById('loading-spinner').style.display = 'none';
      console.error('Error:', error);
      btn.disabled = false;
    });
});

window.addEventListener('DOMContentLoaded', (event) => {

});