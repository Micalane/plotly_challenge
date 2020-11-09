function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metaData = data.metaData;
        
        var wantedArray = metaData.filter(sampleObj => sampleObj.id == sample);
        var result = wantedArray[0];
        
        var panel = d3.select("#sample-metadata");

        panel.html("");

        Object.entries(result).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`);
        });
        
    });
    
}

//charts
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var wantedArray = samples.filter(sampleobj => sampleobj.id == sample);
        var result = wantedArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        var config = { responsive: true }
        //bar chart
        var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        var barData = [{
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        var barLayout = {
            title: "Greatest Quanities of Bacteria Cultures Found",
            margin: { t: 50, l: 150, r: 0 }
        }

        //plot bar chart
        Plotly.newPlot("bar", barData, barLayout, config)
        //bubble chart
        var bubbleData = [{

            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Picnic" //found at https://plotly.com/javascript/colorscales/#picnic-colorscale 
            }
        }];
        var bubbleLayout = {
            title: "Cultures Per Sample",
            margin: { t: 50 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout, config)
    });
}

function init() {
    
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sNames = data.names;

        sNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        var sample1 = sNames[0];
        buildCharts(sample1);
        buildMetadata(sample1);
    });


}

function optionChanged(changedSample) {
    buildCharts(changedSample);
    buildMetadata(changedSample);
}

//init app

init();