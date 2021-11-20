//--------------------------------------Set up Canvas-------------------------------------------------------------//
let w = 800,
  h = 600;
let padding = {top: 100, right: 200, bottom: 100, left: 100};
let width = w - padding.left - padding.right;
let height = h - padding.top - padding.bottom;

d3.select('#histogram-area').append('div').attr('id', 'histogram');

d3.json('../testData/statistic.json').then(function (data) {
    data = JSON.parse(data)
    console.log(data.slice(1, 5))
    let labels = Object.keys(data[0]).filter(function (d) {
      return d !== 'Name'
    });
    console.log('properties includes:', labels)

    // Set default status
    createHistogram('Rating', data);
    d3.select('#slider-1').on('change', handleSliderChange)
    d3.select('#slider-2').on('change', handleSliderChange)
    let initialRecipeList = getRecipeList('Rating', '0', '100', 5)
    displayRecipeList(initialRecipeList)

    //---------------------------------------------Add Statistic Button----------------------------------------//

    labels = d3.select('div.buttons')
      .selectAll('input[name="statistics]"')
      .data(labels)
      .enter()
      .append('label')
    labels.attr('transform', 'translate(' + 100 + ',0)')
    let inputs = labels
      .append('input')
      .attr('id', type => (type + '-button'))
      .attr('class', 'statisticInput')
      .attr('name', 'statistics')
      .attr('type', 'radio')
      .attr('value', function (d) {
        return d
      })
      .on('click', handleClick)
      .append('text').text(function (d) {
        return d
      })
    labels.append('text').text(function (d) {
      return d
    })
    document.getElementById('Rating-button').setAttribute('checked', 'true')


    //-----------------------------------------------Draw histogram---------------------------------------------------//

    function createHistogram(statisticType, values) {
      values = values.map(function (d) {
        return d[statisticType]
      })

      let svg = d3
        .select('#histogram')
        .append('svg')
        .attr('id', 'myHistogram')
        .attr('width', w)
        .attr('height', h);

      let histogram = d3.histogram();
      let bins = histogram(values);

      // Create scale
      let maxPoint = d3.max(values);
      let minPoint = d3.min(values);
      let maxCount = d3.max(bins, function (d) {
        return d.length;
      });
      let maxCountBin = bins.reduce(function (a, b) {
        if (a.length >= b.length) {
          return a;
        } else {
          return b;
        }
      });
      let xScale = d3.scaleLinear().domain([minPoint, maxPoint]).range([0, width]);
      let yScale = d3.scaleLinear().range([height, 0]).domain([0, maxCount]);

      svg
        .selectAll('rect')
        .data(bins)
        .enter()
        .append('rect')
        .attr('x', function (d) {
          return padding.left + xScale(d.x0);
        })
        .attr('transform', function (d) {
          return 'translate(0,' + (yScale(d.length) + padding.top) + ')';
        })
        .attr('width', function (d) {
          return xScale(d.x1) - xScale(d.x0) - 1;
        })
        .attr('height', function (d) {
          return height - yScale(d.length);
        })
        .style('fill', '#fec44f');

      svg
        .append('text')
        .text(maxCount)
        .attr('class', 'data-label')
        .attr('x', padding.left + xScale(maxCountBin.x0) + w / 100)
        .attr('y', padding.top + yScale(maxCount) - h / 100);

      //Add chart title
      svg
        .append('text')
        .text(statisticType + ' Distribution Histogram')
        .attr('class', 'chart-title')
        .attr('x', padding.left - 30)
        .attr('y', padding.top / 2);

      // Add Axes
      let xAxis = d3.axisBottom(xScale).ticks(bins.length + 1)
      svg.append('g').call(xAxis)
        .attr('transform', 'translate(' + padding.left + ',' + (height + padding.top) + ')')

      let yAxis = d3.axisLeft(yScale)
      svg.append('g')
        .call(yAxis)
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      svg.append('text')
        .text('Count')
        .attr('class', 'axis-label')
        .attr('x', padding.left / 2)
        .attr('y', padding.top + height / 2)
        .attr('transform', 'rotate(-90,' + (padding.left / 2) + ',' + (padding.top + height / 2) + ')')

      svg.append('text')
        .text('Stat')
        .attr('class', 'axis-label')
        .attr('x', padding.left + width / 2)
        .attr('y', padding.top + height + 40)


      // Add filter triangle
      let triangle = d3.symbol().type(d3.symbolTriangle).size(50)

      svg.append('g')
        .selectAll('.filter-triangle')
        .data([minPoint, maxPoint])
        .enter()
        .append('path')
        .attr('d', triangle)
        .attr('class', 'filter-triangle')
        .style('fill', 'black')
        .attr('transform', function (d) {
          let x_transform = padding.left + (xScale(d))
          let y_transform = padding.top + height + 6
          return 'translate(' + x_transform + ',' + y_transform + ')'
        })
    }

    function updateHistogram(statType, values) {
      d3.select('#myHistogram').remove();
      createHistogram(statType, values);
    }

    function filterHistogram(statType, lowerLimit, upperLimit) {
      console.log(statType + ';' + lowerLimit + ';' + upperLimit)

      let selectedValues = data.map(d => (d[statType]))
      console.log(d3.max(selectedValues))
      let histogram = d3.histogram();
      let bins = histogram(selectedValues)


      d3.selectAll('rect').data(bins).transition()
        .style('fill', function (bin) {
          if (bin.x1 > upperLimit) {
            return '#706c6c' // Grey color
          } else if (bin.x0 < lowerLimit) {
            return '#706c6c'
          } else {
            return '#fec44f' // Yellow Color
          }
        })

      // Update filter triangle
      let xScale = d3.scaleLinear().domain([d3.min(selectedValues), d3.max(selectedValues)]).range([0, width])
      d3.selectAll('.filter-triangle')
        .data([lowerLimit, upperLimit])
        .attr('transform', function (d) {
          let x_transform = padding.left + (xScale(d))
          let y_transform = padding.top + height + 6
          return 'translate(' + x_transform + ',' + y_transform + ')'
        })

    }

    function handleClick() {
      updateHistogram(this.value, data)
    }

    function handleSliderChange() {
      let statType = getStatType()

      let selectedData = data.map(d => (d[statType]))

      let minValue = d3.min(selectedData)
      let maxValue = d3.max(selectedData)
      let range = maxValue - minValue

      let lowerLimit = document.getElementById('slider-1').value * 0.01 * range + minValue
      let upperLimit = document.getElementById('slider-2').value * 0.01 * range + minValue

      filterHistogram(statType, lowerLimit, upperLimit)
      let Recipes = getRecipeList(statType, lowerLimit, upperLimit)
      updateRecipeList(Recipes)
    }

    function getRecipeList(statType, lowerLimit, upperLimit, size = 5) {
      let selectedDate = data.filter(function (recipe) {
        return (recipe[statType] > lowerLimit && recipe[statType] < upperLimit)
      })

      // Sort all data according to its rating, descending
      let sortedData = selectedDate.sort(function (a, b) {
        return b.Rating - a.Rating
      })
      return sortedData.slice(0, size)
    }
  }
)

function getStatType() {
  let buttons = document.getElementsByName('statistics')
  let statType
  buttons.forEach(function (button) {
    if (button.checked) {
      statType = button.value
    }
  })
  return statType
}

function displayRecipeList(recipeList) {

  let container = document.getElementById('recommendation-area')
  container.innerHTML = 'Recommended List: <br><br>'
  for (let i = 0; i < recipeList.length; i++) {
    container.innerHTML += 'Recipe Name:' + recipeList[i].Name + '<br><br>'
  }
}

function updateRecipeList(recipeList) {
  console.log('now is updating')
  d3.select('#recommendation-area').empty()
  displayRecipeList(recipeList)
}