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

        data.forEach((itemData) => {
          let whoisContent = plain2html(itemData.whois);

          modalData[itemData.domain] = whoisContent;
          temp += "<tr>";
          temp += "<td>" + itemData.domain + "</td>";
          temp += "<td>" + (itemData.active == 1 ? "Sim" : "Não") + "</td>";
          temp += "<td>" + itemData.status + "</td>";
          temp += `<td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#whoisModal" onclick="replaceModalContent('${itemData.domain}')" >WHOIS</button></td>`;
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
              buttons: ['pageLength',
                {
                  extend: 'copyHtml5',
                  exportOptions: {
                    columns: [0, 1, 2]
                  }
                },
                {
                  extend: 'csvHtml5',
                  exportOptions: {
                    columns: [0, 1, 2]
                  }
                },
                {
                  extend: 'excelHtml5',
                  exportOptions: {
                    columns: [0, 1, 2]
                  }
                },
                'print'
              ]
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

                column
                  .data()
                  .unique()
                  .sort()
                  .each(function (d, j) {
                    if (!d.startsWith('<button'))
                      select.add(new Option(d));
                  });
              });
          }
        });
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