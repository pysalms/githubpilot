const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dataRows = document.getElementById('dataRows');
const renderChartBtn = document.getElementById('renderChartBtn');
const refreshChartBtn = document.getElementById('refreshChartBtn');
const downloadChartBtn = document.getElementById('downloadChartBtn');
const chartCanvas = document.getElementById('bucksChart');
let bucksChart;

function getRandomInRange(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function createInputField(name, value = 0) {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.step = '0.01';
  input.value = value;
  input.name = name;
  input.className = 'form-control table-input';
  return input;
}

function buildDataTable() {
  months.forEach((month, index) => {
    const row = document.createElement('tr');
    const monthCell = document.createElement('th');
    monthCell.scope = 'row';
    monthCell.textContent = month;

    const incomeCell = document.createElement('td');
    const incomeValue = getRandomInRange(200, 400);
    const incomeInput = createInputField(`income-${index}`, incomeValue);
    incomeCell.appendChild(incomeInput);

    const expenseCell = document.createElement('td');
    const expenseValue = getRandomInRange(75, 200);
    const expenseInput = createInputField(`expense-${index}`, expenseValue);
    expenseCell.appendChild(expenseInput);

    row.appendChild(monthCell);
    row.appendChild(incomeCell);
    row.appendChild(expenseCell);
    dataRows.appendChild(row);
  });
}

function getChartData() {
  const incomes = [];
  const expenses = [];

  months.forEach((_, index) => {
    const incomeValue = parseFloat(document.querySelector(`input[name='income-${index}']`).value) || 0;
    const expenseValue = parseFloat(document.querySelector(`input[name='expense-${index}']`).value) || 0;
    incomes.push(incomeValue);
    expenses.push(expenseValue);
  });

  return { incomes, expenses };
}

function renderChart() {
  const chartData = getChartData();
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: chartData.incomes,
        backgroundColor: 'rgba(13, 110, 253, 0.7)',
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: chartData.expenses,
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1,
      }
    ]
  };

  const config = {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: context => `${context.dataset.label}: $${context.formattedValue}`
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `$${value}`
          }
        }
      }
    }
  };

  if (bucksChart) {
    bucksChart.data = data;
    bucksChart.options = config.options;
    bucksChart.update();
  } else {
    bucksChart = new Chart(chartCanvas, config);
  }
}

function downloadChartPNG() {
  if (!bucksChart) {
    renderChart();
  }

  const imageUrl = chartCanvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.href = imageUrl;
  downloadLink.download = 'bucks2bar-chart.png';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

renderChartBtn.addEventListener('click', () => {
  renderChart();
  const chartTab = new bootstrap.Tab(document.querySelector('#chart-tab'));
  chartTab.show();
});

refreshChartBtn.addEventListener('click', renderChart);
downloadChartBtn.addEventListener('click', downloadChartPNG);

buildDataTable();
renderChart();
