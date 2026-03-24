document.getElementById("upload").addEventListener("change", handleFile);

function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        displayTable1(json);
        processTable2(json);
    };

    reader.readAsArrayBuffer(file);
}

function displayTable1(data) {
    const table = document.getElementById("table1");
    table.innerHTML = "";

    data.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");

        row.forEach(cell => {
            const cellElement = document.createElement(rowIndex === 0 ? "th" : "td");
            cellElement.textContent = cell;
            tr.appendChild(cellElement);
        });

        table.appendChild(tr);
    });
}

function processTable2(data) {
    const values = {};

    // Skip header row, start from row 1
    for (let i = 1; i < data.length; i++) {
        const index = data[i][0];
        const value = Number(data[i][1]);

        if (index) {
            values[index] = value;
        }
    }

    const alpha = values["A5"] + values["A20"];
    const beta = values["A15"] / values["A7"];
    const charlie = values["A13"] * values["A12"];

    const table2 = document.getElementById("table2");
    table2.innerHTML = `
        <tr>
            <th>Category</th>
            <th>Value</th>
        </tr>
        <tr>
            <td>Alpha</td>
            <td>${alpha}</td>
        </tr>
        <tr>
            <td>Beta</td>
            <td>${beta}</td>
        </tr>
        <tr>
            <td>Charlie</td>
            <td>${charlie}</td>
        </tr>
    `;
}