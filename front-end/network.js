d3.select("title").text("graph");

//-------------------------------------------Parse Data---------------------------------------------//
d3.dsv(",", "../testData/ingredients.csv", function (d) {
  return {
    source: d.source,
    target: d.target,
    frequency: +d.frequency,
  };
})
  .then(function (data) {
    var links = data;
    console.log(links);

    var nodes = {};

    // compute the distinct nodes from the links.
    links.forEach(function (link) {
      link.source =
        nodes[link.source] || (nodes[link.source] = { name: link.source });
      link.target =
        nodes[link.target] || (nodes[link.target] = { name: link.target });
    });

    console.log(d3.values(nodes));

    var width = 2200,
      height = 1800;

    // Create the network graph by using d3.force
    var force = d3
      .forceSimulation()
      .nodes(d3.values(nodes))
      .force("link", d3.forceLink(links).distance(200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("charge", d3.forceManyBody().strength(-550))
      .alphaTarget(1)
      .on("tick", tick);

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //--------------------------------------------------------Add Static Elements------------------------------------------------------//
    // add the links
    var path = svg
      .append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "link " + d.type;
      });

    // define the nodes
    var node = svg
      .selectAll(".node")
      .data(force.nodes())
      .enter()
      .append("g")
      .attr("class", "node")
      .on("dblclick", doubleClicked)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // add the nodes
    var max_degree = 0;

    node
      .append("circle")
      .attr("id", function (d) {
        return d.name.replace(/\s+/g, "").toLowerCase();
      })
      .attr("r", function (d) {
        d.weight = links.filter(function (link) {
          return link.source.index == d.index || link.target.index == d.index;
        }).length;
        if (d.weight > max_degree) {
          max_degree = d.weight;
        }
        var minRadius = 5;
        return minRadius + d.weight * 2;
      })
      .style("fill", decide_node_fill);

    function decide_node_fill(d) {
      if (d.weight < max_degree / 3) {
        return "#fff7bc";
      } else if (d.weight < (max_degree * 2) / 3) {
        return "#fec44f";
      } else {
        return "#d95f0e";
      }
    }

    node
      .append("svg:text")
      .text(function (d) {
        return d.name;
      })
      .attr("dx", 10)
      .attr("dy", -10)
      .style("font-weight", "bold");

    // add the curvy lines
    function tick() {
      path.attr("d", function (d) {
        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return (
          "M" +
          d.source.x +
          "," +
          d.source.y +
          "A" +
          dr +
          "," +
          dr +
          " 0 0,1 " +
          d.target.x +
          "," +
          d.target.y
        );
      });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }
    //--------------------------------------------------------Set Event Function------------------------------------------------------//
    function doubleClicked(d) {
      d3.select("#" + d.name.replace(/\s+/g, "").toLowerCase()).style(
        "fill",
        decide_node_fill
      );
      d.fx = null;
      d.fy = null;
    }

    function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      d.fixed = true;
      if (!d3.event.active) force.alphaTarget(0);

      // pin nodes after drag
      d.fx = d3.event.x;
      d.fy = d3.event.y;

      //change color for pinned nodes
      d3.select("#" + d.name.replace(/\s+/g, "").toLowerCase()).style(
        "fill",
        "black"
      );
    }
  })
  .catch(function (error) {
    console.log(error);
  });
