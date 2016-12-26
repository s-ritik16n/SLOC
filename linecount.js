var fs = require('fs');
var path = require('path');
var front = 0;
var pardir;
var currdir=__dirname;
var dir;
var queue = [];
var total = 0;

function enqueue(data){
  queue[queue.length] = data;
}

function dequeue(){
  front++;
}

function proc(){
  var doc = queue[front];
  dequeue();
  var p = path.join(doc.path,doc.name);
  if(fs.lstatSync(p).isDirectory()){
    dir = fs.readdirSync(p);
    for(i in dir){
      enqueue({name: dir[i],path: p});
    }
  }
  else {
    if(p !== __filename){
    contents = fs.readFileSync(p,'utf-8');
    var count = 0;
    for(i in contents){
      if(contents[i] == "\n"){
        count++;
      }
    }
    if(count == 1){
      console.log(p+": "+count+" line");
    }
    else {
      console.log(p+": "+count+" lines");
    }
    total+=count;
    }
  }
}

function main(){
  currdir = __dirname;
  dir = fs.readdirSync(__dirname);
  console.log('\n');
  for(i in dir){
    enqueue({name:dir[i],path:currdir});
  }
  while (queue.length > front) {
    proc();
  }
  console.log("\nTotal lines: "+total+"\n");
}
main();
