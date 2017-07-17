const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
let front = 0, total = 0;
let currdir,dir;
var queue = [];

function enqueue(data){
  queue[queue.length] = data;
}

function dequeue(){
  front++;
}

function proc(){
  let doc = queue[front];
  dequeue();
  let p = path.join(doc.path,doc.name);
  if(fs.lstatSync(p).isDirectory()){
    dir = fs.readdirSync(p);
    for(i in dir){
      enqueue({name: dir[i],path: p});
    }
  }
  else {
    contents = fs.readFileSync(p,'utf-8');
    let stream = gulp.src(p);
    console.log("stream is:",stream);
    let count = 0;
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

function main(){
  currdir = __dirname;
  dir = fs.readdirSync(__dirname);
  console.log('\n');
  for(i in dir){
    if(path.join(__dirname,dir[i]) !== __filename && (dir[i] !== '.git')){
      enqueue({name:dir[i],path:currdir});
    }
  }
  while (queue.length > front) {
    proc();
  }
  console.log("\nTotal lines: "+total+"\n");
}

gulp.task('count',()=>{
  main();
});
