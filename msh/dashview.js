async function getWarehouses() {
  try {
    const response = await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=supplier"
      )
      .then((response) => {
        let srcArray = [];
        srcArray = response.data;
        let bor = [],
          cc = [],
          shrink = [],
          storage = [],
          ti =[]
        for (i = 0; i < srcArray.length; i++) {
          // bor.push({ y: srcArray[i].BackOrderRate, label: srcArray[i].Name });
          cc.push({ y: parseInt(srcArray[i].CarryingCost), label: srcArray[i].Name });
          shrink.push({ y: srcArray[i].InventoryRiskCost, label: srcArray[i].Name });
          storage.push({ y: srcArray[i].StorageCosts, label: srcArray[i].Name });
          ti.push({ y: srcArray[i].TotalInventoryCost, label: srcArray[i].Name });
        }
        var chart3 = new CanvasJS.Chart("chartContainer3", {
          animationEnabled: true,
          title: {
            text: "Shrinkage Rate & Carrying Cost",
          },
          axisY: {
            title: "",
            includeZero: true,
            maximum: 35,
            minimum: 0,
          },
          legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
          },
          toolTip: {
            shared: true,
            content: toolTipFormatter,
          },
          data: [
            {
              type: "stackedArea",
              showInLegend: true,
              name: "Shrinkage (%)",
              color: "green",
              dataPoints: shrink,
            },
            {
              type: "stackedArea",
              showInLegend: true,
              name: "Carrying Cost (%)",
              color: "orange",
              dataPoints: cc,
            },
          ],
        });
        chart3.render();

        function toolTipFormatter(e) {
          var str = "";
          var str2;
          for (var i = 0; i < e.entries.length; i++) {
            var str1 =
              '<span style= "color:' +
              e.entries[i].dataSeries.color +
              '">' +
              e.entries[i].dataSeries.name +
              "</span>: <strong>" +
              e.entries[i].dataPoint.y +
              "</strong> <br/>";
            str = str.concat(str1);
          }
          str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";

          return str2.concat(str);
        }

        function toggleDataSeries(e) {
          if (
            typeof e.dataSeries.visible === "undefined" ||
            e.dataSeries.visible
          ) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          chart3.render();
          chart5.render();

        }

        var chart5 = new CanvasJS.Chart("chartContainer5", {
          animationEnabled: true,
          title: {
            text: "Storage Costs & Total Inventory Costs",
          },
          axisY: {
            title: "",
            includeZero: true,
            maximum: 200000,
            interval:20000,
            minimum: 1000,
          },
          legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
          },
          toolTip: {
            shared: true,
            content: toolTipFormatter,
          },
          data: [
            {
              type: "line",
              lineDashType: "dash",
              showInLegend: true,
              name: "Storage Cost",
              color: "green",
              dataPoints: storage,
            },
            {
              type: "line",
              lineDashType: "dash",
              showInLegend: true,
              name: "Total Inventory Cost",
              color: "blue",
              dataPoints: ti,
            }
          ],
        });
        chart5.render();

      });
  } catch (errors) {
    console.error(errors);
  }
}

async function getFactories2() {
  try {
    const response = await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=plant"
      )
      .then((response) => {
        const dismissloader = document.getElementById("loader");
        dismissloader.style.display = "none";
        const targetNode = document.getElementById("myChart");

        let srcArray = [];
        srcArray = response.data;
        let eff = [],
          rel = [],
          trust = [],
          qc = [],
          it = [];
          uc = [],lc=[]
        for (i = 0; i < srcArray.length; i++) {
          eff.push({ y: srcArray[i].Efficency, label: srcArray[i].Name });
          rel.push({ y: srcArray[i].Reliability, label: srcArray[i].Name });
          trust.push({ y: srcArray[i].Trust, label: srcArray[i].Name });
          qc.push({
            y: srcArray[i].QualityComplianceLevel,
            label: srcArray[i].Name,
          });
          it.push({ y: srcArray[i].InventoryType, label: srcArray[i].Name });
          // uc.push({y: srcArray[i].VariableCosts.UtilityCosts, label: srcArray[i].Name})
          // lc.push({y: srcArray[i].VariableCosts.LaborCosts, label: srcArray[i].Name})
          uc.push({y: srcArray[i].VariableCosts.UtilityCosts, label: srcArray[i].Name, year:'2022'})
          uc.push({y: srcArray[i].VariableCosts.UtilityCosts + srcArray[i].VariableCosts.UtilityCosts* 0.1, label: srcArray[i].Name, year:'2023'})
          uc.push({y: parseInt(srcArray[i].VariableCosts.UtilityCosts +srcArray[i].VariableCosts.UtilityCosts* 0.20), label: srcArray[i].Name, year:'2024'})
          lc.push({y: srcArray[i].VariableCosts.LaborCosts, label: srcArray[i].Name, year:'2022'})
          lc.push({y: srcArray[i].VariableCosts.LaborCosts + srcArray[i].VariableCosts.LaborCosts* 0.1, label: srcArray[i].Name, year:'2023'})
          lc.push({y: parseInt(srcArray[i].VariableCosts.LaborCosts +srcArray[i].VariableCosts.LaborCosts* 0.20), label: srcArray[i].Name, year:'2024'})
          
        }

        lc = lc.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue['year']] = result[currentValue['year']] || []).push(
              currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
          }, {}); // empty object is the initial value for result object
 

          uc = uc.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue['year']] = result[currentValue['year']] || []).push(
              currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
          }, {}); // empty object is the initial value for result object

        // lc.push({'2022':lc})
        // lc.push({'2023':lc})
        // lc.push({'2024':lc})

        console.log('lc ::: ', lc)
        var chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title: {
            text: "Efficiency & Reliability",
          },
          axisY: {
            title: "",
            includeZero: true,
            maximum: 105,
            minimum: 40,
          },
          legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
          },
          toolTip: {
            shared: true,
            content: toolTipFormatter,
          },
          data: [
            {
              type: "spline",
              showInLegend: true,
              name: "Efficiency (%)",
              color: "green",
              dataPoints: eff,
            },
            {
              type: "spline",
              showInLegend: true,
              name: "Reliability (%)",
              color: "orange",
              dataPoints: rel,
            },
          ],
        });
        chart.render();

        function toolTipFormatter(e) {
          var str = "";
          var str2;
          for (var i = 0; i < e.entries.length; i++) {
            var str1 =
              '<span style= "color:' +
              e.entries[i].dataSeries.color +
              '">' +
              e.entries[i].dataSeries.name +
              "</span>: <strong>" +
              e.entries[i].dataPoint.y +
              "</strong> <br/>";
            str = str.concat(str1);
          }
          str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";

          return str2.concat(str);
        }

        function toggleDataSeries(e) {
          if (
            typeof e.dataSeries.visible === "undefined" ||
            e.dataSeries.visible
          ) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          chart.render();
          chart4.render();
        }

        var chart2 = new CanvasJS.Chart("chartContainer2", {
          animationEnabled: true,
          title: {
            text: "Quality & Trust",
          },
          axisY: {
            title: "",
            includeZero: true,
            maximum: 105,
            minimum: 40,
          },
          legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
          },
          toolTip: {
            shared: true,
            content: toolTipFormatter,
          },
          data: [
            {
              type: "spline",
              showInLegend: true,
              name: "Quality (%)",
              color: "green",
              dataPoints: qc,
            },
            {
              type: "spline",
              showInLegend: true,
              name: "Trust (%)",
              color: "blue",
              dataPoints: trust,
            },
          ],
        });
        chart2.render();

        var chart4 = new CanvasJS.Chart("chartContainer4", {
          animationEnabled: true,
          title: {
            text: "Labor Costs",
          },
          axisY: {
            title: "",
            includeZero: true,
            maximum: 25000,
            interval:5000,
            minimum: 1000,
          },
          legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
          },
          toolTip: {
            shared: true,
            content: toolTipFormatter,
          },
          data: [
           
            {
              type: "spline",
              showInLegend: true,
              name: "2022",
              color: "blue",
              dataPoints: lc[2022]
            },
            {
              type: "spline",
              showInLegend: true,
              name: "2023",
              color: "green",
              dataPoints: lc[2023],
            },
            {
              type: "spline",
              showInLegend: true,
              name: "2024",
              color: "orange",
              dataPoints: lc[2024]
            },
          ],
        });
        chart4.render();
      });
  } catch (errors) {
    console.error(errors);
  }
}
