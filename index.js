const CLASS_LABEL = Array("setosa", "versicolor", "virginica");


const result = document.getElementById("prediction");
const resultj48 = document.getElementById("j48");

const explain = document.getElementById("fuzzyexplain");

const vslength = document.getElementById("slength");
const vswidth = document.getElementById("swidth");
const vplength = document.getElementById("plength");
const vpwidth = document.getElementById("pwidth");

const result_parts = document.getElementById("parts");
const result_rt = document.getElementById("randomtree");


// max
// array([7.9, 4.4, 6.9, 2.5])

//min
// array([4.3, 2. , 1. , 0.1])


// Async loading

model = "";
(async () => {
  console.log("before start");

  //  document.getElementById("loader").style.display = "block";

  model = await tf.loadLayersModel("iris-modeljs/model.json");
  //model.summary();
  console.log("after start");
  //  document.getElementById("loader").style.display = "none";

  // Remove loading class from body
  document.body.classList.remove("loading");

})();



function jscaler(slength, swidth, plength, pwidth) {
  //sucky minmax scaler written by Mohammad Hafiz bin Ismail
  // mypapit@gmail.com


  sslength = (slength - 4.3) / (7.9 - 4.3);
  sswidth = (swidth - 2.0) / (4.4 - 2);
  splength = (plength - 1.0) / (6.9 - 1);
  spwidth = (pwidth - 0.1) / (2.5 - 0.1);

  return [sslength, sswidth, splength, spwidth];


}


function predictdt(slength, swidth, plength, pwidth) {

  if (plength < 2.45) {

    return [1.0, 0.0, 0.0];

    //1.0 iri setosa

  }

  //left side
  if (pwidth < 1.75) {

    //left side
    if (plength < 4.95) {

      if (pwidth < 1.65) {

        return [0.0, 1.0, 0.0];
        //1.0 versicolor
      }

      return [0.0, 0.0, 1.0];
      //1.0 virginica

    } // end plength < 4.95

    if (pwidth < 1.55) {
      return [0.0, 0.0, 1.0];
      //1.0 virginica
    }

    if (slength < 6.95) {
      return [0.0, 1.0, 0.0];
      //1.0 versicolor

    }

    return [0.0, 0.0, 1.0]
    //1.0 virginica




  } // end pwidth < 1.75

  //pwidth >=1.75

  if (plength < 4.85) {
    if (slength < 5.95) {
      return [0.0, 1.0, 0.0];
      //1.0 versicolor

    } // end of slength < 5.95

    return [0.0, 0.0, 1.0];
    //1.0 virginica


  } // end of plength < 4.85


  return [0.0, 0.0, 1.0];
  //1.0 virginica




}


function predictpart(plength, pwidth) {

  if (pwidth <= 0.6) {
    return [1.0, 0.0, 0.0];
    //1.0 setosa
  }

  if ((pwidth <= 1.7) && (plength <= 4.9)) {
    return [0.02041, 0.97959, 0.0];
    //0.97959 iris versicolor
    //0.02041 // iris setosa

  }

  return [0.0273, 0.0273, 0.9455];
  //0.945454 iris-virginica
  //0.027273
  //0.027273



}



function tfpredict() {
  //  6.2	3.4	5.4	2.3

  slength = parseFloat(vslength.value);
  swidth = parseFloat(vswidth.value);
  plength = parseFloat(vplength.value);
  pwidth = parseFloat(vpwidth.value);

  ar = jscaler(slength, swidth, plength, pwidth);

  jb = tf.tensor(ar);
  //  (async () => {
  mx = model.predict(jb.reshape([1, 4])).dataSync();

  //mx.print();

  topk = Array.from(mx)
    .map(function(p, i) {
      return {
        probability: p,
        className: CLASS_LABEL[i],
        classnum: i
      };
    });

  top2 = topk.sort(function(a, b) {
    return b.probability - a.probability;
  });

  console.log(top2[0].className);

  result.innerHTML = "";

  top2.forEach(function(p) {
    console.log(p.className + ":" + p.probability.toFixed(4));
    result.innerHTML =
      result.innerHTML +
      p.className +
      ":" +
      p.probability.toFixed(4) +
      "<br />";
  });

  rj48 = classifyIris(plength, pwidth);

  j48top = Array.from(rj48)
    .map(function(p, i) {
      return {
        probability: p,
        className: CLASS_LABEL[i],
        classnum: i
      };
    });

  j48top2 = j48top.sort(function(a, b) {
    return b.probability - a.probability;
  });

  console.log(j48top2[0].className);
  resultj48.innerHTML = "";

  j48top2.forEach(function(p) {
    console.log(p.className + ":" + p.probability.toFixed(4));
    resultj48.innerHTML =
      resultj48.innerHTML +
      p.className +
      ":" +
      p.probability.toFixed(4) +
      "<br />";
  });

  parts = predictpart(plength, pwidth);
  randomtree = predictdt(slength, swidth, plength, pwidth);

  parts_top = Array.from(parts)
    .map(function(p, i) {
      return {
        probability: p,
        className: CLASS_LABEL[i],
        classnum: i
      };
    }).sort(function(a, b) {
      return b.probability - a.probability;
    });


  result_parts.innerHTML = "";
  parts_top.forEach(function(p) {
    console.log(p.className + ":" + p.probability.toFixed(4));
    result_parts.innerHTML =
      result_parts.innerHTML +
      p.className +
      ":" +
      p.probability.toFixed(4) +
      "<br />";
  });


  randomtree_top = Array.from(randomtree)
    .map(function(p, i) {
      return {
        probability: p,
        className: CLASS_LABEL[i],
        classnum: i
      };
    }).sort(function(a, b) {
      return b.probability - a.probability;
    });

  result_rt.innerHTML = "";
  randomtree_top.forEach(function(p) {
    console.log(p.className + ":" + p.probability.toFixed(4));
    result_rt.innerHTML =
      result_rt.innerHTML +
      p.className +
      ":" +
      p.probability.toFixed(4) +
      "<br />";
  });






  data = {
    labels: CLASS_LABEL,
    datasets: [{
        label: 'TensorFlowjs - NN',
        data: Array.from(mx),
        backgroundColor: 'rgb(255, 99, 132,0.2)',
        borderColor: 'rgb(255, 99, 132)',
        fill: true


      },
      {
        label: 'J48',
        data: rj48,
        backgroundColor: 'rgb(99, 255, 132,0.2)',
        borderColor: 'rgb(99, 255, 132)',
        fill: true


      },
      {
        label: 'PARTS',
        data: parts,
        backgroundColor: 'rgb(99, 132, 255,0.2)',
        borderColor: 'rgb(99, 132, 255)',
        fill: true


      },
      {
        label: 'RandomTree',
        data: randomtree,
        backgroundColor: 'rgb(200, 0, 200,0.2)',
        borderColor: 'rgb(200,0, 200)',
        fill: true


      }
    ]
  };


  config = {
    type: 'radar',
    data: data,
    options: {
      responsive: false,
      elements: {
        line: {
          borderWidth: 3
        }
      }
    },
  };



  if (typeof myChart !== 'undefined') {

    myChart.data.datasets[0].data = Array.from(mx);
    myChart.data.datasets[1].data = rj48;
    myChart.data.datasets[2].data = parts;
    myChart.data.datasets[3].data = randomtree;
    myChart.update();

    //console.log(config);
    console.log("chart updated!");
  } else {
    myChart = "";
    myChart = new Chart(
      document.getElementById('radar'),
      config
    );
  }

  myChart.update();

  //  })();

}


function classifyIris(length, width) {

  if (width <= 0.6) {
    //	return "Iris-setosa";
    return [1.0, 0.0, 0.0];
  } else {
    if (width > 1.7) {
      //return "Iris-virginica";
      return [0.0, 0.0213, 0.9787];
    } else {
      if (length <= 4.9) {
        //return "Iris-versicolor";
        return [0.02041, 0.979592, 0.0];

      } else {
        if (width > 1.5) {
          // return "Iris-versicolor";
          return [0.10, 0.75, 0.15];
        } else {

          //	return "Iris-virginica";
          return [0.0, 0.0, 1.0];
        }
      }
    }

  }



}

function ddx() {
  if (navigator.share) {
    navigator
      .share({
        title: "Machine Learning Iris Web Demo",
        text: "Online demonstration of multiple Machine Learning techniques on Iris dataset",
        url: window.location.href
      })
      .then(() => {
        //alert('Thanks for sharing!');
      })
      .catch(err => {
        alert("Couldn't share because " + err.message);
      });
  } else {
    //alert('Web share not supported, please use compatible device!');
  }
}

function dprobability() {
  result.classList.toggle("showprobability");
}
