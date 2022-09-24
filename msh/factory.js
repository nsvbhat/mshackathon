let factoryInformation;
let wareHouseInformation;
let packShipmentInformation;
let googleReady = false;
let dataReady = false;

function onloadHandler(eff, rel, trust) {
  if (dataReady) google.charts.load("current", { packages: ["gauge"] });
  google.setOnLoadCallback(function () {
    drawVisualization(eff, rel, trust);
  });
}

function onloadHandlerWH(cc, rc, br) {
  if (dataReady) google.charts.load("current", { packages: ["gauge"] });
  google.setOnLoadCallback(function () {
    drawVisualizationWH(cc, rc, br);
  });
}

async function drawVisualization(eff, rel, trust) {
  var data = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["", eff],
    ["", rel],
    ["", trust],
  ]);

  var options = {
    width: 400,
    height: 120,
    redFrom: 0,
    redTo: 75,
    yellowFrom: 75,
    yellowTo: 90,
    greenFrom: 91,
    greenTo: 100,
    minorTicks: 5,
  };

  var chart = new google.visualization.Gauge(
    document.getElementById("chart_div")
  );

  chart.draw(data, options);
}

async function drawVisualizationWH(cc, rc, br) {
  var datacc = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["", cc],
  ]);
  var datarc = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["", rc],
  ]);
  var databr = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["", br],
  ]);

  var options = {
    width: 400,
    height: 120,
    redFrom: 76,
    redTo: 100,
    yellowFrom: 31,
    yellowTo: 75,
    greenFrom: 0,
    greenTo: 30,
    minorTicks: 5,
  };

  var options2 = {
    width: 400,
    height: 120,
    redFrom: 41,
    redTo: 100,
    yellowFrom: 16,
    yellowTo: 40,
    greenFrom: 0,
    greenTo: 15,
    minorTicks: 5,
  };

  var options3 = {
    width: 400,
    height: 120,
    greenFrom: 0,
    greenTo: 30,
    yellowFrom: 31,
    yellowTo: 70,
    redFrom: 71,
    redTo: 100,
    minorTicks: 5,
  };
  var chart1 = new google.visualization.Gauge(
    document.getElementById("chart_divwh")
  );
  var chart2 = new google.visualization.Gauge(
    document.getElementById("chart_divwh2")
  );
  var chart3 = new google.visualization.Gauge(
    document.getElementById("chart_divwh3")
  );

  chart1.draw(datacc, options);
  chart2.draw(datarc, options2);
  chart3.draw(databr, options3);
}

async function getFactoryDatails() {
  try {
    await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=plant"
      )
      .then((response) => {
        // console.log(response);
        factoryInformation = response.data;
        getWarehouseDetails();
        getShipmentDetails();
      });
  } catch (errors) {
    console.log(errors);
  }
}

async function getWarehouseDetails() {
  try {
    await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=supplier"
      )
      .then((response) => {
        // console.log(response);
        wareHouseInformation = response.data;
        mapLoader();
      });
  } catch (errors) {
    console.log(errors);
  }
}

async function getShipmentDetails() {
  try {
    await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=shipment"
      )
      .then((response) => {
        // console.log(response);
        packShipmentInformation = response.data;
        mapLoader();
      });
  } catch (errors) {
    console.log(errors);
  }
}

function initMap() {
  google.load("visualization", "1.1", {
    packages: ["corechart"],
  });
  var center = {
    // lat: 40.1704523,
    // lng: 46.6334962,
    // lat: 19.1472609,
    // lng: 77.2808355,
    lat: 17.3390022,
    lng: 76.8049207,
  };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    minZoom: 3,
    center: center,
  });

  var infowindow = new google.maps.InfoWindow({});
  var marker, count;

  for (count = 0; count < factoryInformation.length; count++) {
    let coordinates = factoryInformation[count].Location.Coordinates.split(",");
    let lat = coordinates[0];
    let lan = coordinates[1];

    const image = {
      url: "./assets/square-pin.png",
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    };
    // The final coordinate closes the poly by connecting to the first coordinate.
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lan),
      icon: "./assets/industry.png",
      map: map,
      label: "F",
      title: factoryInformation[count].Name,
    });
    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, count) {
        return function () {
          dataReady = true;
          const inventory = factoryInformation[count].Products;

          const eff = factoryInformation[count].Efficency;
          const rel = factoryInformation[count].Reliability;
          const trust = factoryInformation[count].Trust;
          const Name = factoryInformation[count].Supplier;
          let popUpContent =
            `<h2 class="popupHeader">` +
            factoryInformation[count].Name +
            `</h2><br>`
            
          popUpContent +=
            ` </div></div>
            <div style="display:flex;">
            <div class="boxes2"> <h5>Lead Time:</h5> <h1>` +
            factoryInformation[count].LeadTime +
            ` days</h1></div>
            <div class="boxes2"> <h5>Open Orders:</h5> <h1>` +
            factoryInformation[count].OpenOrders +
            `</h1></div>
            </div>
            `;

          popUpContent += `
          <br><div class="containert">
          <ul class="responsive-table2" style="min-height:500px;overflow: scroll">
          <li class="table-header" style="background:limegreen; font-weight:bold;">
          <div class="col col-1">Products</div>
          <div class="col col-2">Inventory Level</div>
          <div class="col col-3">Count</div>
          <div class="col col-4">Action</div>
          </li>`;
          inventory.forEach((item,count) => {
            if (item.count > 1000) {
              // console.log('item',Object.keys(item))
              popUpContent +=
                `<li class="table-row">
                <div class="col col-1">` +
                item.product +
                `</div>` +
                `<div class="col col-2" style="color:green;"><b>High</b></div>
                  <div class="col col-3" style="color:green;"><b>` +
                item.count +
                `</b></div>
                <div class="col col-4">None</div>
              </li>`;
            } else if (item.count > 500 && item.count <= 1000) {
              popUpContent +=
                `<li class="table-row">
                <div class="col col-1">` +
                item.product +
                `</div><div class="col col-2" style="color:#EAAA00"><b>Medium</b></div>
                <div class="col col-3" style="color:#EAAA00"><b>` +
                item.count +
                `</b></div>
                <div class="col col-4">None</div></li>`;
            } else {
              popUpContent +=
                `<li class="table-row">
              <div class="col col-1">` +
                item.product +
                `</div><div class="col col-2" style="color:red"><b>Low</b></div>
              <div class="col col-3" style="color:red"><b>` +
                item.count +
                `</b></div>
              <div class="col col-4"><a style="text-decoration:underline" href="./alternatives.html?sid=` +
              Name +
                `&type=` +
                item.product +
                `&coord=` +
                lat +
                `,` +
                lan +
                `">Find Alternatives</a></div></li>`;
            }
          });
          popUpContent += `</ul></div>`;
          infowindow.setContent(popUpContent);
          infowindow.open(map, marker);
        };
      })(marker, count)
    );
  }

  for (count = 0; count < wareHouseInformation.length; count++) {
    let coordinates =
      wareHouseInformation[count].Location.Coordinates.split(",");
    let lat = coordinates[0];
    let lan = coordinates[1];
    const image1 = {
      //  url:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      url: "./assets/wh.png",
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(32, 40),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    };
    // The final coordinate closes the poly by connecting to the first coordinate.
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lan),
      map: map,
      icon: image1,
      // label: 'W',
      title: wareHouseInformation[count].Name,
    });
    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, count) {
        dataReady = true;
        return function () {
          // console.log('asdasdasd',wareHouseInformation[count].Name)
          const inventory = wareHouseInformation[count].Products;
          console.log("inventor", inventory);
          const name = wareHouseInformation[count].Name;
          // let avg = 0;
          // let totVal = 0;
          // for (const product in inventory) {
          //   avg += inventory[product].NumberOfItems;
          //   totVal++;
          // }
          // avg = avg / totVal;
          // console.log("inventry level ", avg);
          // const percent = Math.floor(avg / 3000) * 100;
          cc = parseInt(wareHouseInformation[count].CarryingCost);
          rc = wareHouseInformation[count].InventoryRiskCost;
          br = wareHouseInformation[count].BackOrderRate;
          let popUpContent =
            `<h2 class="popupHeader">` +
            wareHouseInformation[count].Name +
            `</h2>`;
          popUpContent += `
            <div style="display:flex;">
            </div> </div></div>
            <div style="display:flex;">
            <div class="boxes2"> <h5>Lead Time:</h5> <h1>` +
            wareHouseInformation[count].LeadTime +
            ` days</h1></div>
            <div class="boxes2"> <h5>Open Orders:</h5> <h1>` +
            wareHouseInformation[count].OpenOrders +
            `</h1></div>
            <div class="boxes2"> <h5>ESG:</h5> <h1>` +
            wareHouseInformation[count].OpenOrders +
            `</h1></div>
            </div>
            `;
            
            popUpContent += `
            <br><div class="container">
            <ul class="responsive-table">
            <li class="table-header" style="background:limegreen; font-weight:bold;">
            <div class="col col-1">Orders</div>
            <div class="col col-2"></div>
            <div class="col col-3">Period</div>
            <div class="col col-4">To</div>
            <div class="col col-5">Status</div>
            </li>`;
        
            for (let i = 0; i < wareHouseInformation[count].Orders.length; i++) {
              //list icons
              let iconHttml = "";
              wareHouseInformation[count].Orders[i].icon.forEach((icon) => {
               iconHttml +=
                 `<img style="height:20px;" src="./assets/` + icon + `"/>`;
              });
              popUpContent +=
               `
              <li class="table-row">
              <div class="col col-1">Order# ` +
              wareHouseInformation[count].Orders[i].id +
               `</div>
               <div class="col col-2">` +
               iconHttml +
               `</div>
              <div class="col col-3" >` +
              wareHouseInformation[count].Orders[i].quarter +
               `</div>
              <div class="col col-4">` +
              wareHouseInformation[count].Orders[i].to +
               `</div>`;
              if (
                wareHouseInformation[count].Orders[i].orderStatus == "Cancelled"
              ) {
               popUpContent +=
                 `<div class="col col-5" style="color:red;">` +
                 wareHouseInformation[count].Orders[i].orderStatus +
                 `<img style= "height:20px;margin-top:-2px;" src="./assets/alert.png"/> </div>`;
              } else {
               popUpContent +=
                 `<div class="col col-5">` +
                 wareHouseInformation[count].Orders[i].orderStatus +
                 `</div>`;
              }
              `</li>`;
            }
          popUpContent += `</ul></div>`;
          infowindow.setContent(popUpContent);
          infowindow.open(map, marker);
        };
      })(marker, count)
    );
  }
  const shipmentInformation = getFlightPathCoordinatesByShipment();
  shipmentInformation.forEach((shipment) => {
    if (shipment.ShipmentType === "Truck") {
      polylineOptions = { strokeColor: shipment.strokeColor };
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions,
        preserveViewport: true,
      });
      var start = new google.maps.LatLng(
        shipment.shipmentDetails[2].lat,
        shipment.shipmentDetails[2].lng
      );
      var end = new google.maps.LatLng(
        shipment.shipmentDetails[0].lat,
        shipment.shipmentDetails[0].lng
      );
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
      };
      directionsService.route(request, function (response, status) {
        directionsRenderer.setDirections(response);
        // var opt = { minZoom: 3, maxZoom: 6, zoom: 4,center:{lat: 17.3390022,
        //   lng: 76.8049207,

        // } };
        // map.setOptions(opt);
      });
      // .then((response) => {
      //   directionsRenderer.setDirections(response);
      // });
      directionsRenderer.setMap(map);
    } else {
      console.log("ship", shipmentInformation);
      // console.log("strike color ", shipment.strokeColor)
      const flightPath = new google.maps.Polyline({
        path: shipment.shipmentDetails,
        geodesic: true,
        strokeColor: shipment.strokeColor,
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              strokeColor: "#393",
            },
          },
        ],
      });
      flightPath.setMap(map);
    }

    const planeImage = {
      url: "./assets/plane.png",
    };
    const shipImage = {
      url: "./assets/ship.png",
    };
    const truckImage = {
      url: "./assets/truck.png",
    };

    if (shipment.shipmentDetails.length > 2) {
      const flightMarker = new google.maps.Marker({
        position: new google.maps.LatLng(
          shipment.shipmentDetails[1].lat,
          shipment.shipmentDetails[1].lng
        ),
        icon:
          shipment.ShipmentType == "Air"
            ? planeImage
            : shipment.ShipmentType == "Truck"
            ? truckImage
            : shipImage,
        map: map,
      });
    }
  });
}

function mapLoader() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDK8rAh4-8vlkINmIWf2njGuRKkseHajws&callback=initMap";
  document.body.appendChild(script);
}

function getFlightPathCoordinatesByShipment() {
  let flightPlanCoordinates = [];

  let shipmentInfo = [];
  factoryInformation.forEach((factory) => {
    const fromCoordinates = factory.Location.Coordinates.split(",");
    const currLoc =
      factory.ShipmentDetails.length > 0
        ? factory.ShipmentDetails[0].CurrentLocation.split(",")
        : undefined;

    factory.ShipmentDetails.forEach((shipment) => {
      let flightPathDetails = {}; //[{shipmentDetails:[{lat:ddd, lon:ddd},{lat:ddd, lon:ddd}], color}]
      flightPlanCoordinates.push(
        {
          lat: parseFloat(fromCoordinates[0]),
          lng: parseFloat(fromCoordinates[1]),
        },
        { lat: parseFloat(currLoc[0]), lng: parseFloat(currLoc[1]) }
      );
      const wareHouse = wareHouseInformation.filter(
        (warehouseInfo) => warehouseInfo.Name === shipment.FromLocation
      )[0];
      if (wareHouse) {
        const wareHouseCoordinates = wareHouse.Location.Coordinates.split(",");
        flightPlanCoordinates.push({
          lat: parseFloat(wareHouseCoordinates[0]),
          lng: parseFloat(wareHouseCoordinates[1]),
        });
      }
      flightPathDetails["shipmentDetails"]
        ? flightPathDetails["shipmentDetails"].push(flightPlanCoordinates)
        : (flightPathDetails["shipmentDetails"] = flightPlanCoordinates);
      flightPathDetails["strokeColor"] =
        shipment.DelayDetails.DelayInDays > 0 ? "#FF0000" : "#008000";
      flightPathDetails["ShipmentType"] = shipment.ShipmentType[0];
      flightPlanCoordinates = [];
      shipmentInfo.push(flightPathDetails);
    });
  });
  return shipmentInfo;
}
