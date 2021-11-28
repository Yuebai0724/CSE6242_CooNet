function updateinfocard(){

  d3.json('/get-pred').then(function(data) {
    data = JSON.parse(data)

    var infocard = $('#infocard > div')[0];
    infocard.children[1].remove()

    $(<p>)
      .text(data)
  }
}
