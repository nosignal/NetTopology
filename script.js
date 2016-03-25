// draw network topology with json data

var width = 640;
var height = 480;
var imageByType = {
"host_online" : "images/host.png",
"router_online" : "images/router.png",
"switch_online" : "images/switch.png",
"ap_online" : "images/ap.png",
"host_offline" : "images/host.png",
"router_offline" : "images/router.png",
"switch_offline" : "images/switch.png",
"ap_offline" : "images/ap.png"
};

var root = d3.select("body");

root.append("h1").append("text").text("Network Topology Graph");
root.append("h3").append("text").text("Draw with D3 via JSON data");

var svg = root.append("svg")
  .attr("width", width)
  .attr("height", height);

var force = d3.layout.force()
  .gravity(0.05)
  .distance(100)
  .charge(-600)
  .size([width, height]);

var tooltip = d3.select("body")
  .append("div")
  .attr("class","tooltip")
  .style("opacity",0.0);

d3.json("topology.json", function(error, json) {
  var edges = [];
  json.links.forEach(function(e) {
    var endpoint1 = json.devices.filter(function(n) {
        return n._id === e.endpoint1;
      })[0],
      endpoint2 = json.devices.filter(function(n) {
        return n._id === e.endpoint2;
      })[0];

    edges.push({
      source: endpoint1,
      target: endpoint2,
      value: e._id,
      speed: e.speed
    });
  });

  force
    .nodes(json.devices)
    .links(edges)
    .start();

  var link = svg.selectAll(".link")
    .data(edges)
    .enter().append("line")
    .attr("class", "link");

  var node = svg.selectAll(".node")
    .data(json.devices)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

  node.append("image")
    .attr("xlink:href", function(d) {
      return imageByType[d.category+"_"+d.status]
    })
    .attr("x", "-15px")
    .attr("y", "-15px")
    .attr("width", "30px")
    .attr("height", "30px");

  var $text = node.append("svg:a")
    .attr("xlink:href", function(d) {
      return d.url;
    })
    .append("text")
    .text(function(d) {
      return d.name;
    })
    .attr("x", 12);

  link.on("mouseover", function(d) {
    tooltip.html("Link speed: " + d.speed)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity",1.0);
    })
    .on("mousemove", function(d) {
        tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.style("opacity",0.0);
    })

  node.on("mouseover", function(d) {
    tooltip.html("ipv4: " + d.ipv4 + "</br>" + "ipv6: " + d.ipv6)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity",1.0);
    })
    .on("mousemove", function(d) {
        tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.style("opacity",0.0);
    })

  force.on("tick", function() {
    link.attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
});
