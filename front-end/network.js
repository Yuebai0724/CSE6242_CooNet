d3.select("title").text("graph");

//-------------------------------------------Parse Data---------------------------------------------//
d3.dsv(",", "../testData/ingredients.csv", function (d) {
  return {
    source: d.source,
    target: d.target,
    frequency: +d.frequency,
    isSourceSelected: d.is_source_selected,
    isTargetSelected: d.is_target_selected,
  };
})
  .then(function (data) {
    var links = data;
    console.log(links);

    var nodes = {};

    // compute the distinct nodes from the links.
    links.forEach(function (link) {
      link.source =
        nodes[link.source] ||
        (nodes[link.source] = {
          name: link.source,
          isSelected: link.isSourceSelected,
        });
      link.target =
        nodes[link.target] ||
        (nodes[link.target] = {
          name: link.target,
          isSelected: link.isTargetSelected,
        });
    });
    console.log(nodes);

    //Compute total frequency for each node
    d3.values(nodes).forEach((d) => {
      let newLinks = links.filter(function (link) {
        return link.source.name === d.name || link.target.name === d.name;
      });
      d.frequency = d3.sum(newLinks, (link) => link.frequency);
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
      .force("charge", d3.forceManyBody().strength(-2050))
      .alphaTarget(1)
      .on("tick", tick);

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //---------------------------------------------------Add Elements--------------------------------------------//
    //---------------------------------------------------- add links---------------------------------------------//

    let pathOpacityScale = d3.scaleLinear().range([0, 1]);
    let pathWidthScale = d3.scaleLinear().range([0.2, 3]);
    let max_link_frequency = d3.max(links, function (link) {
      return link.frequency;
    });
    let min_link_frequency = d3.min(links, function (link) {
      return link.frequency;
    });
    pathOpacityScale.domain([min_link_frequency, max_link_frequency]);
    pathWidthScale.domain([min_link_frequency, max_link_frequency]);

    var path = svg
      .append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "link " + d.type;
      })
      .style("stroke-opacity", function (d) {
        return pathOpacityScale(d.frequency);
      })
      .style("stroke-width", function (d) {
        return pathWidthScale(d.frequency);
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

    //------------------------------------------------------Add Nodes-------------------------------------------------//
    let nodesValue = d3.values(nodes);
    console.log(nodesValue);
    let max_frequency = d3.max(nodesValue, function (d) {
      return d.frequency;
    });
    let min_frequency = d3.min(nodesValue, function (d) {
      return d.frequency;
    });
    console.log(max_frequency);

    //Set circle properties for nodes

    let rScale = d3.scaleLinear().range([8, 40]);
    rScale.domain([min_frequency, max_frequency]);
    console.log(rScale(30000));

    node
      .append("circle")
      .attr("id", function (d) {
        return d.name.replace(/\s+/g, "").toLowerCase();
      })
      .attr("r", function (d) {
        return rScale(d.frequency);
      })
      .style("fill", decide_node_fill);

    function decide_node_fill(d) {
      if (d.isSelected == 1) {
        return "black";
      } else {
        return "white";
      }
    }

    node
      .append("svg:text")
      .attr("class", "node-label")
      .text(function (d) {
        return d.name;
      })
      .attr("dx", 15)
      .attr("dy", -15)

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
