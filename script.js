// Code goes here

var width = 640,
  height = 480;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var force = d3.layout.force()
  .gravity(0.05)
  .distance(100)
  .charge(-600)
  .size([width, height]);

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
      value: e._id
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

  node.append("circle")
    .attr("class", "node")
    .attr("r", 5);

  var $text = node.append("svg:a")
    .attr("xlink:href", function(d) {
      return d.url;
    })
    .append("text")
    .text(function(d) {
      return d.name;
    })
    .attr("x", 12);

  var $tspan = [];

  for (i = 0; i < 2; i++) {
    $tspan[i] = $text.append('tspan');
  }

  $tspan[0]
    .text(function(d) {
      return "ipv4: " + d.ipv4;
    })
    .attr("name", "t0")
    .attr("x", 12)
    .attr("dy", "1.2em")
    //.style("visibility", "hidden");
    //.style("opacity", 0);
    .style("display", "none");

  $tspan[1]
    .text(function(d) {
      return "ipv6: " + d.ipv6;
    })
    .attr("name", "t1")
    .attr("x", 12)
    .attr("dy", "1.2em")
    //.style("visibility", "hidden");
    //.style("opacity", 0);
    .style("display", "none");

  node.on('mouseover', function(d) {
      //return d3.select(this).select("text").selectAll("tspan").style("visibility", "visible");
      //return d3.select(this).select("text").selectAll("tspan").style("opacity", 1);
      return d3.select(this).select("text").selectAll("tspan").style("display", "block");
    })
    .on('mouseout', function(d) {
      //return d3.select(this).select("text").selectAll("tspan").style("visibility", "hidden");
      //return d3.select(this).select("text").selectAll("tspan").style("opacity", 0);
      return d3.select(this).select("text").selectAll("tspan").style("display", "none");
    });

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