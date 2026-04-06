export function generateExamples(count=5){

const arr=[]

for(let i=0;i<count;i++){

let a=Math.floor(Math.random()*10)
let b=Math.floor(Math.random()*10)

let operator=Math.random()>0.5?"+":"-"

let result = operator==="+" ? a+b : a-b

if(result<0){
i--
continue
}

arr.push({
a,
b,
operator,
result
})

}

return arr
}