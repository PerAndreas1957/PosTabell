function loadXMLDoc() {
    var tot = 0;
    var bad = 0;
    var green = 0;
    var yellow = 0;
    var red = 0;
    var xmlhttp = new XMLHttpRequest();
  
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        [tot, bad, green, yellow, red] = getXMLData(this);
        drawChartOnline(tot, bad);
        drawChartSize(green, yellow, red);
      }
    };
    xmlhttp.open("GET", "MPOS.xml", true);
    xmlhttp.send();
  
    }
  
  function getXMLData(xml) {
    var i;
    var z = 0;
    var green = 0;
    var yellow = 0;
    var red  = 0;
    var totalSize = 0;
    var tableOnline ='<thead class="fixedHeader"><tr><th>Terminal name</th><th>Terminal number</th><th>Store number</th><th>Date</th><th>Online</th></tr></thead>';
    var tableSize   ='<thead class="fixedHeader"><tr><th>Terminal name</th><th>Terminal number</th><th>Total Size</th><th>Date</th></tr></thead>';
    var online = 0
    var terminalNumber, terminalName, storeNumber, storeName;
    var transDate;
    var xmlDoc = xml.responseXML;
  
    var x = xmlDoc.getElementsByTagName("row");
  
    tableSize   += '<tbody class="scrollContent">';
    tableOnline += '<tbody class="scrollContent">';
  
    for (i = 0; i <x.length; i++) { 
    
      online        = x[i].getElementsByTagName("Online")[0].childNodes[0].nodeValue;
      terminalName  = x[i].getElementsByTagName("TerminalName")[0].childNodes[0].nodeValue;
      terminalNumber= x[i].getElementsByTagName("TerminalNumber")[0].childNodes[0].nodeValue;
      storeNumber   = x[i].getElementsByTagName("StoreNumber")[0].childNodes[0].nodeValue;
      storeName     = x[i].getElementsByTagName("StoreName")[0].childNodes[0].nodeValue;
  
      if(online == '1'){
        totalSize     = x[i].getElementsByTagName("TotalSize")[0].childNodes[0].nodeValue;
      }
      else {
        totalSize = 0;
      }
  
      if (i==0){
        transDate   = new Date(x[i].getElementsByTagName("Date")[0].childNodes[0].nodeValue).toLocaleDateString('nb-NO');
      }
  
        if(online == '0'){
          z++; //not online
          tableOnline += 
          "<tr><td>" + terminalName +
          "</td><td>"+ terminalNumber +
          "</td><td>"+ storeNumber +
          "</td><td>"+ transDate +
          "</td><td>"+ online +
          "</td></tr>";
      }
      if (totalSize < 8000) { 
        green++;  
      }
      else if (totalSize < 10000) { 
        yellow++;  
      }
      else { 
        red++;  
      }
  
      tableSize += 
      "<tr><td>" + terminalName +
      "</td><td>"+ terminalNumber +
      "</td><td>"+ totalSize +
      "</td><td>"+ transDate +
      "</td></tr>";
  
    }
  
    tableSize   += "</tbody>";
    tableOnline += "</tbody>";
  
    document.getElementById("dataTable_Online").innerHTML = tableOnline;
    document.getElementById("dataTable_Size").innerHTML = tableSize;
    
    sorttable.makeSortable(dataTable_Online);
    sorttable.makeSortable(dataTable_Size);
    
    stripedTable();
  
    return [i, z, green, yellow, red];
  }
  
  google.charts.load("current", {packages:["corechart"]});
  // google.charts.setOnLoadCallback(drawChart);
  
  function drawChartOnline(t, b) {
    var data = google.visualization.arrayToDataTable([
        ['Status', 'MPOS Online'],
        ['Online',     t-b],
        ['Offline',      b]
    ]);
      
    var options = {
        title: 'MPOS online/offline',
        is3D: true,
    };
  
    var chart = new google.visualization.PieChart(document.getElementById('chartOnline'));
    chart.draw(data, options);
  }
  
  function drawChartSize(green, yellow, red) {
    var data = google.visualization.arrayToDataTable([
        ['Status', 'MPOS Online'],
        ['Size < 8 GB',  green],
        ['Size 8-10 GB', yellow],
        ['Size > 10 GB', red]
    ]);
      
    var options = {
        title: 'MPOS Offline DB size',
        is3D: true,
    };
  
    var chart = new google.visualization.PieChart(document.getElementById('chartSize'));
    chart.draw(data, options);
  }
  
  function removeClassName (elem, className) {
      elem.className = elem.className.replace(className, "").trim();
  }
  
  function addCSSClass (elem, className) {
      removeClassName (elem, className);
      elem.className = (elem.className + " " + className).trim();
  }
  
  String.prototype.trim = function() {
      return this.replace( /^\s+|\s+$/, "" );
  }
  
  function stripedTable() {
      if (document.getElementById && document.getElementsByTagName) {  
          var allTables = document.getElementsByTagName('table');
          if (!allTables) { return; }
  
          for (var i = 0; i < allTables.length; i++) {
              if (allTables[i].className.match(/[\w\s ]*scrollTable[\w\s ]*/)) {
                  var trs = allTables[i].getElementsByTagName("tr");
                  for (var j = 0; j < trs.length; j++) {
                      removeClassName(trs[j], 'alternateRow');
                      addCSSClass(trs[j], 'normalRow');
                  }
                  for (var k = 0; k < trs.length; k += 2) {
                      removeClassName(trs[k], 'normalRow');
                      addCSSClass(trs[k], 'alternateRow');
                  }
              }
          }
      }
  }