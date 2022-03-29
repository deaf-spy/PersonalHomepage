var fs = require('fs');
console.log("hi");
file1 = "test.txt";

function moveGetter(output) {
  const moveList = [];
  var length = output.length;
  for (let i = 0; i < length; i++) {
    if (output[i] == '1' && output[i+1] == '.' && output[i+2] == ' ') {
      output = output.substring(i+3, length);
      //console.log("2, read split input");
      console.log(output);
      break;
    }
  }
  var curr = '';
  length = output.length;
  for (let j = 0; j<length-3; j++) {

    //console.log(j);
    //console.log(curr);
    if (output[j] == ' ' || output[j] == '\n') {
      moveList.push(curr);
      curr = '';
    } else if (output[j] == '.') {
      curr = '';
      j++;
    }
    // else if (output[j] == '-') {
    //   break;
    // }
    else {
      curr += output[j];
    }
  }
  //console.log("3, movelist");
  return moveList;
}


function reader(file) {
  var output = fs.readFileSync(file, {encoding:'utf8', flag:'r'});
  //console.log("1, got input");
  //console.log(output);
  return moveGetter(output);
}

const moves = reader(file1);
console.dir(moves, {'maxArrayLength': null});
