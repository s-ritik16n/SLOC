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

function proc(grunt){
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
    contents = grunt.file.read(p);
    // let stream = gulp.src(p);
    // console.log("stream is:",stream);
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

function main(grunt,exclude){
  grunt.file.defaultEncoding = 'utf8';
  let files = grunt.config('count').files;
  // '!**/node_modules/**'
  grunt.file.expand(['*','!.*'].concat(exclude)).filter((f)=>{
    if(path.join(__dirname,f) !== __filename){
      enqueue({name:f,path:__dirname});
    }
  });
  while (queue.length > front) {
    proc(grunt);
  }
  grunt.log.writeln("\nTotal lines: "+total)
}

module.exports = function(grunt){

  grunt.initConfig({
    count: {}
  })

  grunt.registerTask('count',function(){
    let exclude = [];
    Object.keys(arguments).forEach((k)=>{
      exclude.push("!"+arguments[k]);
    })
    main(grunt,exclude);
  });
}
