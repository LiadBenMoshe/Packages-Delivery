var Chart = require("chart.js");

module.exports = {
  method: function chartSize(params, callback) {
    const data = {
      labels: ["Big", "Medium", "Small"],
      datasets: [
        {
          label: "Package Size",
          data: [params.size.big, params.size.medium, params.size.small],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    const config = {
      type: "doughnut",
      data: data,
    };

    callback(null, config);
  },

  method2: function chartCountry(params, callback) {
    const data = {
      labels: [
        "Russia",
        "England",
        "Italy",
        "China",
        "UnitedStates",
        "Germany",
        "Netherlands",
        "Turkey",
        "Thailand",
        "India",
        "Spain",
      ],
      datasets: [
        {
          label: "Package From",
          data: [
            params.country.Russia,
            params.country.England,
            params.country.Italy,
            params.country.China,
            params.country.UnitedStates,
            params.country.Germany,
            params.country.Netherlands,
            params.country.Turkey,
            params.country.Thailand,
            params.country.India,
            params.country.Spain,
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgb(184,134,11)",
            "rgb(107,142,35)",
            "rgb(0,255,127)",
            "rgb(169,169,169)",
            "rgb(128,0,0)",
          ],
        },
      ],
    };

    const config = {
      type: "doughnut",
      data: data,
    };

    callback(null, config);
  },

  method3: function chartCountry(params, callback) {
    var len=10;
    var itemsNames=[];
    for(var i =0 ;i<len;i++){
      itemsNames.push(params[i][0])
    }
    var itemsValue=[];
    for(var i =0 ;i<len;i++){
      itemsValue.push(params[i][2])
    }


    const data = {
      labels: itemsNames,
      datasets: [
        {
          label: "Frequent itemsets",
          data: itemsValue,
          backgroundColor: ["rgba(44, 238, 241, 0.67)"],
          hoverOffset: 4,
        },
      ],
    };
    var delayed;
    const config = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "BigML Results",
          },
        },
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    };

    callback(null, config);
  },
};
