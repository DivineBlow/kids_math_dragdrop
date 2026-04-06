function generateExamples(){

let examples=[]

while(examples.length<5){

let a=Math.floor(Math.random()*2)+1
let b=Math.floor(Math.random()*2)+1

let type=Math.random()>0.5?"+":"-"

let result=type==="+"?a+b:a-b

if(result>=0 && result<100){

examples.push({a,b,type,result})

}

}

return examples

}