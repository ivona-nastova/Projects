export function generateDateLabels(daysAgo) {
  const array = [];

  for (let i = 0; i < daysAgo; i++) {
    const today = new Date();
    const startDate = today.getDate();
    const currentDate = today.setDate(startDate - i);
    const formattedDate = formatDate(currentDate);
    array.push(formattedDate);
  }
  return array;
}

// Format Data
export function formatDate(dataNumber) {
  const date = new Date(dataNumber);
  return date.toLocaleDateString("en-gb");
}

// Function For Last Days Buttons
export function lastDays(days, chart, array) {
  const labels = generateDateLabels(days);
  chart.data.labels = labels;
  const chartData = labels.map((label) => {
    let sum = 0;

    array.forEach((item) => {
      if (label === formatDate(item.dateSold)) {
        sum += item.priceSold;
      }
    });

    return sum;
  });
  chart.data.datasets[0].data = chartData;
  chart.update();
}
