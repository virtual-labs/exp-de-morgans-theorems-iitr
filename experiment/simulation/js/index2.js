var connections = [];
document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("tab_check1").disabled = true;
    document.getElementById("tab_check2").disabled = true;

});


function reload(event) {
    window.location.reload()
}

function BoardController() {
    var jsPlumbInstance = null;
    var endPoints = [];

    this.setJsPlumbInstance = function(instance) {
        jsPlumbInstance = instance;
    };

    this.setCircuitContainer = function(drawingContainer) {
        jsPlumbInstance.Defaults.Container = drawingContainer;
    };

    this.initDefault = function() {

        jsPlumbInstance.importDefaults({
            Connector: ["Bezier", { curviness: 20 }],
            PaintStyle: { strokeStyle: '#87321b', lineWidth: 4 },
            EndpointStyle: { radius: 3, fillStyle: 'blue' },
            HoverPaintStyle: { strokeStyle: "#26c947" },
            // ConnectionsDetachable: false
        });

        jsPlumbInstance.bind("beforeDrop", function(params) {
            var sourceEndPoint = params.connection.endpoints[0];
            var targetEndPoint = params.dropEndpoint;
            if (!targetEndPoint || !sourceEndPoint) {
                return false;
            }
            var sourceEndPointgroup = sourceEndPoint.getParameter('groupName');
            var targetEndPointgroup = targetEndPoint.getParameter('groupName');

            if (sourceEndPointgroup == targetEndPointgroup) {
                alert("Already connected internally");
                return false;
            } else {
                return true;
            }
        });

        jsPlumbInstance.bind("dblclick", function(conn) {
            jsPlumb.detach(conn);
            return false;
        });

        jsPlumbInstance.bind("jsPlumbConnection", function(conn) {
            var source = conn.connection.endpoints[0].getParameter('endPointName')
            connections[source] = conn.connection;

            $alert("The paragraph was clicked.");

        });
    };

    this.addEndPoint = function(radius, divID, groupName, endPointName, anchorArray, color,stroke) {
        var Stroke;
        if(typeof(stroke)=='undefined'){
            Stroke = '#87321b';
        }
        else{
            Stroke = stroke;
        }
        var endpointOptions = {
            isSource: true,
            isTarget: true,
            anchor: anchorArray,
            maxConnections: 1,
            parameters: {
                "divID": divID,
                "endPointName": endPointName,
                "groupName": groupName,
                "type": 'output',
                "acceptType": 'input'
            },
            paintStyle: { radius: radius, fillStyle: color },
            connectorStyle:{ strokeStyle:Stroke, lineWidth: 4}
        };

        jsPlumbInstance.addEndpoint(divID, endpointOptions);

        setEndpoint(endPointName, endpointOptions);
    };

    var setEndpoint = function(endPointName, endpointOptions) {
        endPoints[endPointName] = {
            "endPointName": endpointOptions.parameters.endPointName,
            "groupName": endpointOptions.parameters.groupName,
            "divID": endpointOptions.parameters.divID
        };

    };

}




var theorem2a;
var theorem2b;

function checkCircuit() {

    var g = new Graph(56);
    theorem2a = false;
    theorem2b = false;


    var groups = ['input_A', 'input_B', 'led_A', 'led_C', 'VCC', 'GND', 'ic7432_VCC', 'ic7432_4A', 'ic7432_4B', 'ic7432_4Y', 'ic7432_3A', 'ic7432_3B', 'ic7432_3Y', 'ic7432_1A', 'ic7432_1B', 'ic7432_1Y', 'ic7432_2A', 'ic7432_2B', 'ic7432_2Y', 'ic7432_GND', 'ic7404_VCC', 'ic7404_6A', 'ic7404_6Y', 'ic7404_5A', 'ic7404_5Y', 'ic7404_4A', 'ic7404_4Y', 'ic7404_1A', 'ic7404_1Y', 'ic7404_2A', 'ic7404_2Y', 'ic7404_3A', 'ic7404_3Y', 'ic7404_GND', 'ic7408_VCC', 'ic7408_4A', 'ic7408_4B', 'ic7408_4Y', 'ic7408_3A', 'ic7408_3B', 'ic7408_3Y', 'ic7408_1A', 'ic7408_1B', 'ic7408_1Y', 'ic7408_2A', 'ic7408_2B', 'ic7408_2Y', 'ic7408_GND', 'row1', 'row3', 'row4', 'row2', 'row5', 'row6', 'row8', 'row7']

    console.log(groups.length)
    for (var i = 0; i < groups.length; i++) { //inserting groups vertexes
        g.addVertex(groups[i]);
    }

    for (key in connections) { // adding edges
        g.addEdge(connections[key].endpoints[0].getParameter('groupName'), connections[key].endpoints[1].getParameter('groupName'));
    }



    var radio = document.getElementsByName('radio');
    var run;
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked)
            run = radio[i].value;
    }

    if (run == '2a') {

        // (A+B)' logic
        if (g.isConnected("ic7408_VCC", "VCC") && g.isConnected("ic7408_GND", 'GND')) {
            console.log("IC7408 connected to supply");
            if (g.isConnected("ic7404_VCC", "VCC") && g.isConnected("ic7404_GND", "GND")) {
                console.log("IC7404 connected to supply")
                if (g.isConnected("led_C", "GND")) {
                    console.log("LED connected to ground")

                    if (g.isConnected("input_A", "ic7408_4A") && g.isConnected("input_B", "ic7408_4B") && g.isConnected("ic7408_4Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4A") && g.isConnected("input_B", "ic7408_4B") && g.isConnected("ic7408_4Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4A") && g.isConnected("input_B", "ic7408_4B") && g.isConnected("ic7408_4Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4A") && g.isConnected("input_B", "ic7408_4B") && g.isConnected("ic7408_4Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4A") && g.isConnected("input_B", "ic7408_4B") && g.isConnected("ic7408_4Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4A") && g.isConnected("input_B", "ic7408_4B") && g.isConnected("ic7408_4Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7408_4B") && g.isConnected("input_B", "ic7408_4A") && g.isConnected("ic7408_4Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4B") && g.isConnected("input_B", "ic7408_4A") && g.isConnected("ic7408_4Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4B") && g.isConnected("input_B", "ic7408_4A") && g.isConnected("ic7408_4Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4B") && g.isConnected("input_B", "ic7408_4A") && g.isConnected("ic7408_4Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4B") && g.isConnected("input_B", "ic7408_4A") && g.isConnected("ic7408_4Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_4B") && g.isConnected("input_B", "ic7408_4A") && g.isConnected("ic7408_4Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7408_3A") && g.isConnected("input_B", "ic7408_3B") && g.isConnected("ic7408_3Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3A") && g.isConnected("input_B", "ic7408_3B") && g.isConnected("ic7408_3Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3A") && g.isConnected("input_B", "ic7408_3B") && g.isConnected("ic7408_3Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3A") && g.isConnected("input_B", "ic7408_3B") && g.isConnected("ic7408_3Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3A") && g.isConnected("input_B", "ic7408_3B") && g.isConnected("ic7408_3Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3A") && g.isConnected("input_B", "ic7408_3B") && g.isConnected("ic7408_3Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7408_3B") && g.isConnected("input_B", "ic7408_3A") && g.isConnected("ic7408_3Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3B") && g.isConnected("input_B", "ic7408_3A") && g.isConnected("ic7408_3Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3B") && g.isConnected("input_B", "ic7408_3A") && g.isConnected("ic7408_3Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3B") && g.isConnected("input_B", "ic7408_3A") && g.isConnected("ic7408_3Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3B") && g.isConnected("input_B", "ic7408_3A") && g.isConnected("ic7408_3Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_3B") && g.isConnected("input_B", "ic7408_3A") && g.isConnected("ic7408_3Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7408_2A") && g.isConnected("input_B", "ic7408_2B") && g.isConnected("ic7408_2Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2A") && g.isConnected("input_B", "ic7408_2B") && g.isConnected("ic7408_2Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2A") && g.isConnected("input_B", "ic7408_2B") && g.isConnected("ic7408_2Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2A") && g.isConnected("input_B", "ic7408_2B") && g.isConnected("ic7408_2Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2A") && g.isConnected("input_B", "ic7408_2B") && g.isConnected("ic7408_2Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2A") && g.isConnected("input_B", "ic7408_2B") && g.isConnected("ic7408_2Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7408_2B") && g.isConnected("input_B", "ic7408_2A") && g.isConnected("ic7408_2Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2B") && g.isConnected("input_B", "ic7408_2A") && g.isConnected("ic7408_2Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2B") && g.isConnected("input_B", "ic7408_2A") && g.isConnected("ic7408_2Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2B") && g.isConnected("input_B", "ic7408_2A") && g.isConnected("ic7408_2Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2B") && g.isConnected("input_B", "ic7408_2A") && g.isConnected("ic7408_2Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_2B") && g.isConnected("input_B", "ic7408_2A") && g.isConnected("ic7408_2Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7408_1A") && g.isConnected("input_B", "ic7408_1B") && g.isConnected("ic7408_1Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1A") && g.isConnected("input_B", "ic7408_1B") && g.isConnected("ic7408_1Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1A") && g.isConnected("input_B", "ic7408_1B") && g.isConnected("ic7408_1Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1A") && g.isConnected("input_B", "ic7408_1B") && g.isConnected("ic7408_1Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1A") && g.isConnected("input_B", "ic7408_1B") && g.isConnected("ic7408_1Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1A") && g.isConnected("input_B", "ic7408_1B") && g.isConnected("ic7408_1Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    }

                    if (g.isConnected("input_A", "ic7408_1B") && g.isConnected("input_B", "ic7408_1A") && g.isConnected("ic7408_1Y", "ic7404_6A") && g.isConnected("ic7404_6Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1B") && g.isConnected("input_B", "ic7408_1A") && g.isConnected("ic7408_1Y", "ic7404_5A") && g.isConnected("ic7404_5Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1B") && g.isConnected("input_B", "ic7408_1A") && g.isConnected("ic7408_1Y", "ic7404_4A") && g.isConnected("ic7404_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1B") && g.isConnected("input_B", "ic7408_1A") && g.isConnected("ic7408_1Y", "ic7404_3A") && g.isConnected("ic7404_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1B") && g.isConnected("input_B", "ic7408_1A") && g.isConnected("ic7408_1Y", "ic7404_2A") && g.isConnected("ic7404_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7408_1B") && g.isConnected("input_B", "ic7408_1A") && g.isConnected("ic7408_1Y", "ic7404_1A") && g.isConnected("ic7404_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2a = true;
                        showOutput();
                    } else if (theorem2a != true) {
                        alert("Wrong Connections")
                    }

                } else {
                    alert("LED not connected to ground")
                }
            } else {
                alert("IC7404 not connected to supply")
            }
        } else {
            alert("ic7408 not connected to supply");
        }
        if (theorem2a == true) {
            var a1 = document.getElementById("a1");
            var a2 = document.getElementById("a2");
            var a3 = document.getElementById("a3");
            var a4 = document.getElementById("a4");
            a1.style.display = "inline";
            a2.style.display = "inline";
            a3.style.display = "inline";
            a4.style.display = "inline";
            document.getElementById("tab_check1").disabled = false;
        }
    }


    // A'B' logic


    if (run == "2b") {

        if (g.isConnected("ic7404_VCC", "VCC") && g.isConnected("ic7404_GND", 'GND')) {
            console.log("IC7404 connected to supply");
            if (g.isConnected("ic7432_VCC", "VCC") && g.isConnected("ic7432_GND", "GND")) {
                console.log("IC7432 connected to supply")
                if (g.isConnected("led_C", "GND")) {
                    console.log("LED connected to ground")

                    if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_6A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else





                    if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_5A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else





                    if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_4A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else




                    if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_3A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else





                    if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_2A") && g.isConnected("input_B", "ic7404_1A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else




                    if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7404_6Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7404_6Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7404_6Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7404_6Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7404_6Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7404_6Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7404_6Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_6A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7404_6Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7404_5Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7404_5Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7404_5Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7404_5Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7404_5Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7404_5Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7404_5Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_5A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7404_5Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7404_4Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7404_4Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7404_4Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7404_4Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7404_4Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7404_4Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7404_4Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_4A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7404_4Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7404_3Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7404_3Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7404_3Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7404_3Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7404_3Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7404_3Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7404_3Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_3A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7404_3Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else

                    if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_4A") && g.isConnected("ic7404_2Y", "ic7432_4B") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_3A") && g.isConnected("ic7404_2Y", "ic7432_3B") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_2A") && g.isConnected("ic7404_2Y", "ic7432_2B") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_1A") && g.isConnected("ic7404_2Y", "ic7432_1B") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_4B") && g.isConnected("ic7404_2Y", "ic7432_4A") && g.isConnected("ic7432_4Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_3B") && g.isConnected("ic7404_2Y", "ic7432_3A") && g.isConnected("ic7432_3Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_2B") && g.isConnected("ic7404_2Y", "ic7432_2A") && g.isConnected("ic7432_2Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (g.isConnected("input_A", "ic7404_1A") && g.isConnected("input_B", "ic7404_2A") && g.isConnected("ic7404_1Y", "ic7432_1B") && g.isConnected("ic7404_2Y", "ic7432_1A") && g.isConnected("ic7432_1Y", "led_A")) {
                        alert("Right Connections");
                        theorem2b = true;
                        showOutput();
                    } else if (theorem2b != true) {
                        alert("Wrong Connections")
                    }

                } else {
                    alert("LED not connected to ground")
                }
            } else {
                alert("IC7432 not connected to supply")
            }
        } else {
            alert("ic7404 not connected to supply");
        }
        if (theorem2b == true) {
            var b1 = document.getElementById("b1");
            var b2 = document.getElementById("b2");
            var b3 = document.getElementById("b3");
            var b4 = document.getElementById("b4");
            b1.style.display = "inline";
            b2.style.display = "inline";
            b3.style.display = "inline";
            b4.style.display = "inline";
            document.getElementById("tab_check2").disabled = false;
        }

    }

    console.log("executed")
}



// console.log(typeof("a1"));


var checked_1a = false;
function a() {
    var a1 = document.getElementById("a1").value;
    var a2 = document.getElementById("a2").value;
    var a3 = document.getElementById("a3").value;
    var a4 = document.getElementById("a4").value;
    if (a1 == '') {
        alert("Fill all the Inputs");
    } else if (a2 == '') {
        alert("Fill all the Inputs");
    } else if (a3 == '') {
        alert("Fill all the Inputs");
    } else if (a4 == '') {
        alert("Fill all the Inputs");
    } else {
        if (a1 === '1') {
            if (a2 === '1') {
                if (a3 === '1') {
                    if (a4 === '0') {
                        alert("Correct Output");
                        checked_1a = true;
                    } else {
                        alert("Incorrect Output");
                    }
                } else {
                    alert("Incorrect Output");
                }
            } else {
                alert("Incorrect Output");
            }
        } else {
            alert("Incorrect Output");
        }
    }
}

var checked_1b=false;
function b() {
    var b1 = document.getElementById("b1").value;
    var b2 = document.getElementById("b2").value;
    var b3 = document.getElementById("b3").value;
    var b4 = document.getElementById("b4").value;
    if (b1 == '') {
        alert("Fill all the Inputs");
    } else if (b2 == '') {
        alert("Fill all the Inputs");
    } else if (b3 == '') {
        alert("Fill all the Inputs");
    } else if (b4 == '') {
        alert("Fill all the Inputs");
    } else {
        if (b1 === '1') {
            if (b2 === '1') {
                if (b3 === '1') {
                    if (b4 === '0') {
                        alert("Correct Output");
                        checked_1b=true;
                        //setTimeout(showModal, 2000)
                    } else {
                        alert("Incorrect Output");
                    }
                } else {
                    alert("Incorrect Output");
                }
            } else {
                alert("Incorrect Output");
            }
        } else {
            alert("Incorrect Output");
        }
    }
}

function resetTable() {
    document.getElementById("a1").value = "";
    document.getElementById("a2").value = "";
    document.getElementById("a3").value = "";
    document.getElementById("a4").value = "";
    document.getElementById("b1").value = "";
    document.getElementById("b2").value = "";
    document.getElementById("b3").value = "";
    document.getElementById("b4").value = "";
    checked_1a = false;
    checked_1b = false;
}

function plus() {
   // alert("Reset Connections before selecting expression.");
    var x = document.getElementById("ic32");
    var y = document.getElementById("ic08");
    var a = document.getElementById("a");
    var b = document.getElementById("b");

    var left = document.getElementById("left_instruct");
    var right = document.getElementById("right_instruct");

    left.style.display ="block";
    right.style.display = "none";

    x.style.display = "none";
    y.style.display = "block";
    a.style.display = "block";
    b.style.display = "none";
}

function multi() {
    alert("Reset Connections before selecting expression.");
    var x = document.getElementById("ic32");
    var y = document.getElementById("ic08");
    var a = document.getElementById("a");
    var b = document.getElementById("b");

    
    var left = document.getElementById("left_instruct");
    var right = document.getElementById("right_instruct");

    left.style.display ="none";
    right.style.display = "block";

    x.style.display = "block";
    y.style.display = "none";
    a.style.display = "none";
    b.style.display = "block";
}

function changeA() {
    var imagea = document.getElementById('input_a');
    if (imagea.src.match("images/switch_1.png")) {
        imagea.src = "images/switch_0.png";
    } else {
        imagea.src = "images/switch_1.png";
    }
    showOutput();
}

function changeB() {
    var imageb = document.getElementById('input_b');
    if (imageb.src.match("images/switch_1.png")) {
        imageb.src = "images/switch_0.png";
    } else {
        imageb.src = "images/switch_1.png";
    }
    showOutput();
}

function showOutput() {
    var switch1 = document.getElementById('input_a').src;
    var switch2 = document.getElementById('input_b').src;

    if (theorem2a == true) {
        if (switch1.match("images/switch_0.png") && switch2.match("images/switch_0.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led1.png')";     
        } else if (switch1.match("images/switch_0.png") && switch2.match("images/switch_1.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led1.png')";     
        } else if (switch1.match("images/switch_1.png") && switch2.match("images/switch_0.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led1.png')";    
        } else if (switch1.match("images/switch_1.png") && switch2.match("images/switch_1.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led.png')";
        }
    }else  if (theorem2b == true) {
        if (switch1.match("images/switch_0.png") && switch2.match("images/switch_0.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led1.png')";     
        } else if (switch1.match("images/switch_0.png") && switch2.match("images/switch_1.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led1.png')";     
        } else if (switch1.match("images/switch_1.png") && switch2.match("images/switch_0.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led1.png')";    
        } else if (switch1.match("images/switch_1.png") && switch2.match("images/switch_1.png")) {
            document.getElementById('led').style.backgroundImage = "url('images/led.png')";
        }
    }
     else {
        return;
    }

}


function showModal(){
    if(checked_1b==true || checked_1a == true){
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        modal.style.display = "block";

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
        }
    }
    else{
        alert("Verify truth table first ")
    }
}


