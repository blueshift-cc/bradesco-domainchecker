function replaceModalContent(data) {
  document.getElementById("whois-data").innerHTML = data;
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
        var status200 = 0;
        var status503 = 0;
        data.forEach((itemData) => {
          let whoisContent = itemData.whois.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\'/g, "\\\'");
          temp += "<tr>";
          temp += "<td>" + itemData.domain + "</td>";
          temp += "<td>" + itemData.status + "</td>";
          temp += `<td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#whoisModal" onclick="replaceModalContent('${whoisContent}')" >WHOIS</button></td>`;

          if (itemData.status == 200) {
            status200++;
          }
          if (itemData.status == 503) {
            status503++;
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
            labels: ["200", "503"],
            datasets: [{
              label: "Códigos de resposta",
              data: [status200, status503],
              backgroundColor: ['blue', 'red'],
              hoverOffset: 5
            }],
          },
          options: {
            responsive: false,
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