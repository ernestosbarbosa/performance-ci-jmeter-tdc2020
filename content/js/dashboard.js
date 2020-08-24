/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.896551724137931, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https:\/\/blazedemo.com\/"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/purchase.php"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/reserve.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/purchase.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/reserve.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/reserve.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/confirmation.php"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/reserve.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/reserve.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/purchase.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/purchase.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/purchase.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/reserve.php"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https:\/\/blazedemo.com\/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/confirmation.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/confirmation.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/confirmation.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/confirmation.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/blazedemo.com\/confirmation.php-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28, 0, 0.0, 2940.5714285714284, 8, 39612, 4291.100000000055, 39504.9, 39612.0, 0.30504412245342627, 6.440482351018629, 0.2609344359407343], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["https:\/\/blazedemo.com\/", 1, 0, 0.0, 39612.0, 39612, 39612, 39612.0, 39612.0, 39612.0, 0.025244875290316066, 7.046845613387357, 0.05699819499141674], "isController": false}, {"data": ["https:\/\/blazedemo.com\/purchase.php", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 3.105590062111801, 17.353697593167702, 9.99611801242236], "isController": false}, {"data": ["https:\/\/blazedemo.com\/reserve.php-0", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 4.184100418410042, 23.445672071129707, 2.047103817991632], "isController": false}, {"data": ["https:\/\/blazedemo.com\/purchase.php-5", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 20.833333333333332, 2.4007161458333335, 11.271158854166666], "isController": false}, {"data": ["https:\/\/blazedemo.com\/purchase.php-4", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 9.70873786407767, 1.137742718446602, 5.252578883495146], "isController": false}, {"data": ["https:\/\/blazedemo.com\/reserve.php-3", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 12.345679012345679, 1.4347029320987654, 6.67920524691358], "isController": false}, {"data": ["https:\/\/blazedemo.com\/reserve.php-4", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 10.752688172043012, 1.2600806451612903, 5.817372311827957], "isController": false}, {"data": ["https:\/\/blazedemo.com\/reserve.php-1", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 7.682291666666667, 34.765625], "isController": false}, {"data": ["https:\/\/blazedemo.com\/confirmation.php", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 2.544529262086514, 11.89517732188295, 8.463541666666666], "isController": false}, {"data": ["https:\/\/blazedemo.com\/reserve.php-2", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 16.129032258064516, 1.8743699596774193, 8.694556451612904], "isController": false}, {"data": ["https:\/\/blazedemo.com\/reserve.php-5", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 9.900990099009901, 1.140934405940594, 5.356590346534653], "isController": false}, {"data": ["https:\/\/blazedemo.com\/purchase.php-3", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 2.0387883771929824, 9.491502192982455], "isController": false}, {"data": ["https:\/\/blazedemo.com\/purchase.php-2", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 2.3716517857142856, 11.001275510204081], "isController": false}, {"data": ["https:\/\/blazedemo.com\/purchase.php-1", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 14.404296875, 65.185546875], "isController": false}, {"data": ["https:\/\/blazedemo.com\/purchase.php-0", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 4.739336492890995, 23.73370853080569, 2.5362855450236967], "isController": false}, {"data": ["Test", 1, 0, 0.0, 40685.0, 40685, 40685, 40685.0, 40685.0, 40685.0, 0.024579083200196635, 7.265231350620621, 0.29434892312891725], "isController": true}, {"data": ["https:\/\/blazedemo.com\/reserve.php", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 2.793296089385475, 17.272608240223466, 8.862713861731844], "isController": false}, {"data": ["https:\/\/blazedemo.com\/-5", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 7.407407407407407, 29.007523148148145, 2.806712962962963], "isController": false}, {"data": ["https:\/\/blazedemo.com\/-4", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 5.847953216374268, 723.6271016081871, 2.204404239766082], "isController": false}, {"data": ["https:\/\/blazedemo.com\/-3", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 7.518796992481203, 289.5250822368421, 2.8415765977443606], "isController": false}, {"data": ["https:\/\/blazedemo.com\/-2", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 7.8125, 220.672607421875, 2.93731689453125], "isController": false}, {"data": ["https:\/\/blazedemo.com\/-1", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 2721.1263020833335, 13.151041666666668], "isController": false}, {"data": ["https:\/\/blazedemo.com\/-0", 1, 0, 0.0, 39374.0, 39374, 39374, 39374.0, 39374.0, 39374.0, 0.025397470411946968, 0.07864783073855844, 0.00897840262609844], "isController": false}, {"data": ["https:\/\/blazedemo.com\/confirmation.php-5", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 11.904761904761903, 1.3718377976190474, 6.440662202380952], "isController": false}, {"data": ["https:\/\/blazedemo.com\/confirmation.php-4", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 9.803921568627452, 1.1488970588235294, 5.304074754901961], "isController": false}, {"data": ["https:\/\/blazedemo.com\/confirmation.php-3", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 7.407407407407407, 0.8608217592592592, 4.007523148148148], "isController": false}, {"data": ["https:\/\/blazedemo.com\/confirmation.php-2", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 2.5263247282608696, 11.71875], "isController": false}, {"data": ["https:\/\/blazedemo.com\/confirmation.php-1", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 8.864182692307693, 40.11418269230769], "isController": false}, {"data": ["https:\/\/blazedemo.com\/confirmation.php-0", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 4.291845493562231, 17.57393374463519, 2.757846030042918], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
