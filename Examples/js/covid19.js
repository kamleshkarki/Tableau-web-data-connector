(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "state",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "confirmed",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "deaths",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "Covid 19 Feed",
            alias: "Covid19 in the last days",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.covid19india.org/state_district_wise.json", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "state": feat[i].districtData,
                    "confirmed": feat[i].confirmed
                    "deaths": feat[i].delta
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Covid19 Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
