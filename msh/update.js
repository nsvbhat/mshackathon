let alternateFactoryInfo;
let alternateWareHouseInfo;
let type, whname, whCoordinates;
let allwareHouseInformation;

async function updateState(state, fromwh, towh, type) {
  try {
    console.log(state);
    const response = await axios
      .get(
        `https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=update&state=${state}&fromwh=${fromwh}&towh=${towh}&type=${type}`
      )
      .then((response) => {
        setTimeout(function () {
          if (response.status == 200) {
            alert("Procurement initiated...");
          }
          //your code to be executed after 1 second
          window.location.href = "sc.html";
        }, 5000);
      });
  } catch (e) {
    console.log(e);
  }
}

async function getFactories() {
  try {
    const response = await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=plant"
      )
      .then((response) => {
        const dismissloader = document.getElementById("loader");
        dismissloader.style.display = "none";
        const targetNode = document.getElementById("blankspace");
        let srcArray = [];
        srcArray = response.data;
        srcArray.sort(
          // (a, b) => a.LeadTime - b.LeadTime || a.Reliability - b.Reliability
          (a, b) => a.Name.localeCompare(b.Name)
        );
        for (const element of srcArray) {
          let iconHTML = "";
          let type = "h";

          for (let key in element.InventoryType) {
            iconHTML +=
              `<div class="tooltip"><img class="tooltip" src="./assets/` +
              element.InventoryType[key].toLowerCase() +
              `-h.png"/><span class="tooltiptext">` +
              element.InventoryType[key].toLowerCase() +
              `</span></div>`;
          }

          targetNode.innerHTML +=
            `<section>
              <div id="${element.Name}" class="place-card-container" style="height:365px; text-align: center;border: 2px dashed green;"> 
                <h1 style="margin-top:10px;font-size:130%;color:rgb(2, 195, 2)" class="place-card-image">${element.Name}</h1> 
               <div class="place-card-container1">
                <div style="display:flex" > ` +
            iconHTML +
            `</div>
                
                    <span class="agent-card-text1">
                      <table style="width:120%!important">
                      <tr><td  style="font-size:14px" >Location</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue">${
                        element.Location.Address
                      }</td></tr>                                    
                      <tr><td  style="font-size:14px" >Lead Time</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue">${
                        element.LeadTime
                      }</td></tr>                                    
                        <tr><td  style="font-size:14px" >Efficiency</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue;${
                          element.Efficency < 90
                            ? "background:#FF2E2E;color:white;"
                            : ""
                        }">${Math.floor(
              element.Efficency
            )} %</td></tr>                                    
                        <tr><td  style="font-size:14px" >Reliability</td><td  style="font-size:14px;font-weight:bold;;text-align:center;color:slateblue;${
                          element.Reliability < 90
                            ? "background:#FF2E2E;color:white"
                            : ""
                        }"">${element.Reliability} %</td></tr>
                        <tr><td  style="font-size:14px" >Trust Quotient</td><td  style="font-size:14px;font-weight:bold;;text-align:center;color:slateblue;${
                          element.Trust < 90
                            ? "background:#FF2E2E;color:white"
                            : ""
                        }">${element.Trust}%</td></tr>
                        <tr><td  style="font-size:14px" >Quality Compliance Level</td><td  style="font-size:14px;font-weight:bold;;text-align:center;color:slateblue;${
                          element.QualityComplianceLevel < 90
                            ? "background:#FF2E2E;color:white"
                            : ""
                        }">${element.QualityComplianceLevel}%</td></tr>
                        <tr><td  style="font-size:14px" >Open Orders</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue">${
                          element.OpenOrders
                        }</td></tr>                                    
                        <tr><td  style="font-size:14px" >Days Of Raw Materials Left</td><td  style="font-size:14px;font-weight:bold;;text-align:center;color:slateblue;${
                          element.DaysOfRawMaterialsLeft < 10
                            ? "background:#FF2E2E;color:white"
                            : ""
                        }">${element.DaysOfRawMaterialsLeft}</td></tr>
                    </table>
                  </span>
                </div>
              </div>
            </section>`;
        }
      });
    //<tr><td  style="font-size:14px" >Customer Loyalty Index</td><td  style="font-size:16px;font-weight:bold;;text-align:center;color:slateblue">${element.CLV}</td></tr>
    //<!-- <tr><td  style="font-size:14px" >Promoter</td><td  style="font-size:16px;font-weight:bold;;text-align:center;color:slateblue">${element.Promoter ? 'Yes':'No'}</td></tr>             -->
    //<!-- <tr><td  style="font-size:14px" >Last Purchased Date</td><td  style="font-size:16px;font-weight:bold;;text-align:center;color:slateblue">${element.LastPurchasedDate.split('T')[0]}</td></tr> -->
  } catch (errors) {
    console.error(errors);
  }
}

async function getWarehouses() {
  try {
    const response = await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=supplier"
      )
      .then((response) => {
        const dismissloader = document.getElementById("loader");
        dismissloader.style.display = "none";
        const targetNode = document.getElementById("blankspace");
        let srcArray = [];
        srcArray = response.data;

        for (const element of srcArray) {
          // console.log('aaaa',element.InventoryType)
          // console.log(`Score ${element.Name}`, recency + monetary + freq)

          let iconHTML = "";
          let type = "h";

          for (let key in element.InventoryType) {
            if (element.InventoryType[key].NumberOfItems > 1000) {
              type = "h";
            } else if (
              element.InventoryType[key].NumberOfItems > 500 &&
              element.InventoryType[key].NumberOfItems <= 1000
            ) {
              type = "m";
            } else {
              type = "l";
            }
            if (element.InventoryType[key].Exists === true) {
              iconHTML +=
                `<div class="tooltip"><img class="tooltip" src="./assets/` +
                key.toLowerCase() +
                `-` +
                type +
                `.png"/><span class="tooltiptext">` +
                key +
                ` items: ` +
                element.InventoryType[key].NumberOfItems +
                `</span></div>`;
            }
          }

          targetNode.innerHTML +=
            `<section>
              <div id="${element.Name}" class="place-card-container" style="height:350px; text-align: center;border: 2px dashed green"> 
                <h1 style="margin-top:10px;font-size:130%;color:rgb(2, 195, 2)" class="place-card-image">${element.Name}</h1> 
               <div class="place-card-container1">
                <div style="display:flex" > ` +
            iconHTML +
            `</div>
                
                    <span class="agent-card-text1">
                      <table style="width:115%!important">
                        <tr><td  style="font-size:14px" >ROI</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue;${
                          element.ROI === "Low"
                            ? "background:#FF2E2E;color:white;"
                            : ""
                        }">${
              element.ROI
            }</td></tr>                                    
                        <tr><td  style="font-size:14px" >Lead Time</td><td  style="font-size:14px;font-weight:bold;;text-align:center;color:slateblue">${
                          element.LeadTime
                        } days</td></tr>
                        <tr><td  style="font-size:14px" >Product Innnovation</td><td  style="font-size:14px;font-weight:bold;;text-align:center;color:slateblue">${
                          element.Innovation
                        }</td></tr>
                        <tr><td  style="font-size:14px" >Compliance</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue;${
                          element.Compliance === "Low"
                            ? "background:#FF2E2E;color:white;"
                            : ""
                        }">${element.Compliance}</td></tr>   
            <tr><td  style="font-size:14px" >Customer Service</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue;${
              element.Service === "Low" ? "background:#FF2E2E;color:white;" : ""
            }">${element.Service}</td></tr>   
<tr><td  style="font-size:14px" >Defect Rates</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue;${
              element.Defectrates === "High"
                ? "background:#FF2E2E;color:white;"
                : ""
            }">${element.Defectrates}</td></tr>   
<tr><td  style="font-size:14px" >Risk</td><td  style="font-size:14px;font-weight:bold;text-align:center;color:slateblue;${
              element.Risk === "High" ? "background:#FF2E2E;color:white;" : ""
            }">${element.Risk}</td></tr>   

                    </table>
                  </span>
                </div>
              </div>
            </section>`;
        }
      });

    //<tr><td  style="font-size:14px" >Customer Loyalty Index</td><td  style="font-size:16px;font-weight:bold;;text-align:center;color:slateblue">${element.CLV}</td></tr>
    //<!-- <tr><td  style="font-size:14px" >Promoter</td><td  style="font-size:16px;font-weight:bold;;text-align:center;color:slateblue">${element.Promoter ? 'Yes':'No'}</td></tr>             -->
    //<!-- <tr><td  style="font-size:14px" >Last Purchased Date</td><td  style="font-size:16px;font-weight:bold;;text-align:center;color:slateblue">${element.LastPurchasedDate.split('T')[0]}</td></tr> -->
  } catch (errors) {
    console.error(errors);
  }
}

async function getAlternativeFactories() {
  const urlParams = new URLSearchParams(location.search);
  console.log(urlParams);
  type = urlParams.get("type") || "";
  whname = urlParams.get("sid") || "";
  whCoordinates = urlParams.get("coord") || undefined;

  try {
    await axios
      .get(
        `https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=supplier&sid=${whname}&type=${type}`
      )
      .then((response) => {
        // console.log( response );
        const dismissloader = document.getElementById("loader");
        dismissloader.style.display = "none";
        alternateFactoryInfo = response.data.factories;
        alternateWareHouseInfo = response.data.warehouses;
        // if (alternateFactoryInfo.length > 0) {
        //   createFactoryTable();
        // } else {
        //   document.getElementById("factoryHeader").innerHTML =
        //     "<p>No Factories available</p>";
        // }
        if (alternateWareHouseInfo.length > 0) {
          getWarehouseDetails(type) 
          
        } else {
          document.getElementById("warehouseHeader").innerHTML =
            "No Warehouses available";
        }
      });
  } catch (error) {
    console.log(error);
  }
}



function createFactoryTable() {
  document.getElementById("factoryHeader").innerHTML = "Alternative Plants";
  alternateFactoryInfo.sort((a, b) => a.LeadTime - b.LeadTime);

  //Factory NAme total inventory TotalInventoryCost
  let factoryTable = "";
  factoryTable += `<div class="alternatives-stats2">
        <h1 class="alternatives-text02" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Factory Name</span></h1>
        <h1 class="alternatives-text02" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Lead Time</span></h1>
        <h1 class="alternatives-text02" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Efficiency</span></h1>
        <h1 class="alternatives-text02" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Reliability</span></h1>
        <h1 class="alternatives-text02" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Distance</span></h1>
        
      </div>`;

  for (let i = 0; i < alternateFactoryInfo.length; i++) {
    let fromLocationCoordinates =
      alternateFactoryInfo[i].Location.Coordinates.split(",");
    console.log("fromLocationCoordinates", fromLocationCoordinates);
    (from1 = fromLocationCoordinates[0]), (from2 = fromLocationCoordinates[1]);
    const p1coords = whCoordinates.split(",");
    const p2coords = alternateFactoryInfo[i].Location.Coordinates.split(",");
    var p1 = new google.maps.LatLng(p1coords[0], p1coords[1]);
    var p2 = new google.maps.LatLng(from1, from2);
    const distance = calcDistance(p1, p2);
    const CFP = calcCarbonFootprint(distance);
    factoryTable +=
      `
      <div id="recommendedFactory" class="alternatives-stats2">
        <div class="alternatives-stat2">
            <h2 class="alternatives-text02"> <span>` +
      alternateFactoryInfo[i].$dtId +
      `</span></h2>
        </div>
        <div class="alternatives-stat2">
          <h2 class="alternatives-text02"><span>` +
      alternateFactoryInfo[i].LeadTime +
      ` days</span></h2>
        </div>
        <div class="alternatives-stat2">
            <h2 class="alternatives-text02"><span>` +
      (alternateFactoryInfo[i].ActualOutput /
        alternateFactoryInfo[i].ManufacturingCapacity) *
        100 +
      ` %</span></h2>
        </div>
        <div class="alternatives-stat2">
            <h2 class="alternatives-text02"><span>` +
      alternateFactoryInfo[i].Reliability +
      ` %</span></h2>
        </div>
        <div class="alternatives-stat">
            <h2 class="alternatives-text01"><span>` +
      distance +
      ` mi</span></h2>
        </div>
<a href="#"><button class="btn" type="button">Procure</button></a>
</div>`;
  }
  document.getElementById("AlternateFactory").innerHTML += factoryTable;
  const getRow = document.getElementById("recommendedFactory");
  getRow.style.backgroundColor = "limegreen";
}


async function getWarehouseDetails(type) {
  try {
    await axios
      .get(
        "https://contactcenterdt.azurewebsites.net/api/DataForApollo?scope=supplier"
      )
      .then((response) => {
        // console.log(response);
        allwareHouseInformation = response.data;
        createWareHouseTable(type);
        //mapLoader();
      });
  } catch (errors) {
    console.log(errors);
  }
}

function createWareHouseTable(type) {

  alternateWareHouseInfo.length > 0
    ? (document.getElementById("warehouseHeader").innerHTML =
        "Supplier Recommendations (Product Type-" + type + ")")
    : "no warehousese";

  //Factory NAme total inventory TotalInventoryCost
  let wareHouseTable = "";
  let arr2 = [];

  wareHouseTable += `
    <div class="alternatives-stats">
        <h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold;"> <span>Supplier Name</span></h1>
        <h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Inventory Type</span></h1>
        <h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Inventory Count</span></h1>
        <h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Location</span></h1>
        <h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Distance</span></h1>
        <h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Carbon Foorprint</span></h1><h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>ESG</span></h1>
        <h1 class="alternatives-text01" style="text-align: center; color: black;font-size: 20px;font-weight:bold"> <span>Margin</span></h1>
        </div>`;
        
  for (let i = 0; i < alternateWareHouseInfo.length; i++) {
    const p1coords = whCoordinates.split(",");
    const p2coords = alternateWareHouseInfo[i].Location.Coordinates.split(",");
    var p1 = new google.maps.LatLng(p1coords[0], p1coords[1]);
    var p2 = new google.maps.LatLng(p2coords[0], p2coords[1]);
    distance = calcDistance(p1, p2);
    alternateWareHouseInfo[i]["distance"] = distance;
    arr2 = alternateWareHouseInfo;
  }

  for (let i = 0; i < arr2.length; i++) {
    arr2.sort((a, b) => a.distance - b.distance);

    wareHouseTable +=
      `<div id="recommendedWH" class="alternatives-stats">
        <div class="alternatives-stat">
          <h2 class="alternatives-text01"> <span>` +
      arr2[i].$dtId +
      `</span></h2>
        </div>
        <div class="alternatives-stat">
          <h2 class="alternatives-text01"><span>` +
      type +
      `</span></h2>
        </div>
        <div class="alternatives-stat">
            <h2 class="alternatives-text01"><span>` +
      arr2[i].InventoryType[type] +
      `</span></h2>
        </div>
        <div class="alternatives-stat">
        <h2 class="alternatives-text01" style="font-size:16px;margin:auto;"><span>` +
      arr2[i].Location.Address +
      `</span></h2>
        </div>
        <div class="alternatives-stat">
        <h2 class="alternatives-text01"><span>` +
      arr2[i].distance +
      ` mi</span></h2>        
        </div>
        <div class="alternatives-stat">
        <h2 class="alternatives-text01"><span>` 
        wareHouseTable +=  Math.floor(calcCarbonFootprint(arr2[i].distance) )
        // wareHouseTable += `<p style="color:red; font-size:15px">&#x25BC;` + ( laborToCostRatioMapping[ alternateFactoryInfo[ i ].$dtId ] - laborToCostRatioMapping[ currentFailureFactory.$dtId ] ) + `%</p>`;
      wareHouseTable +=` g CO2e/mile</span></h2>        
        </div>
        <div class="alternatives-stat">
        <h2 class="alternatives-text01"><span>` 

        if(arr2[i].ESGRating > 0 && arr2[i].ESGRating<=25){
          wareHouseTable +=  "Poor"
        }else if(arr2[i].ESGRating > 25 && arr2[i].ESGRating<=50){
          wareHouseTable +=  "Satisfactory"
        }else if(arr2[i].ESGRating > 50 && arr2[i].ESGRating<=75){
          wareHouseTable +=  "Good"
        }
        else if(arr2[i].ESGRating > 75 ){
          wareHouseTable +=  "Excellent"
        }
       

        wareHouseTable +=  `</span></h2>        
        </div>
        <div class="alternatives-stat">
        <h2 class="alternatives-text01"><span>` 
        wareHouseTable += alternateWareHouseInfo[i].Margin

        wareHouseTable +=  ` %</span></h2>        
        </div>
        <a ><button class="btn" type="button" onclick="updateState('preferred','` +
      arr2[i].$dtId +
      `','` +
      whname +
      `','` +
      type +
      `')">Simulate</button></a>
      </div>`;
  }

  //onclick= "`+updateState('preferred',arr2[i].$dtId,whname,type)+`"

  document.getElementById("AlternateWareHouse").innerHTML += wareHouseTable;
  const getRow = document.getElementById("recommendedWH");
  getRow.style.backgroundColor = "limegreen";
}

var rad = function (x) {
  return (x * Math.PI) / 180;
};

/** Calculates distance in KM's**/
function calcDistance(p1, p2) {
  return (
    google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000
  ).toFixed(2);
}

function calcCarbonFootprint(distance){
  // console.log(distance)
  return ((((8.8/10)*1000)*distance)/1000).toFixed(2)
}
