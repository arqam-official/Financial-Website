let button = document.querySelector("#button");
let submit = document.querySelector("#submit");

submit.addEventListener("click", calculateinvestment)



function calculateinvestment(){
    let Principle = parseFloat(document.querySelector("#amount").value);
    let Time = parseFloat(document.querySelector("#years").value);
    let Rate = parseFloat(document.querySelector("#rate").value /100);
    let Compound = document.querySelector("#compound").value;
    let Contribution = parseFloat(document.querySelector("#additional-contribution").value);
    
    let contributeAt = "";
    let contributeRadio = document.querySelector("input[name='contribute']:checked")
    if(contributeRadio){
        contributeAt = contributeRadio.value
    }
    else{
        contributeAt = "end"
    }

    let contributeFreq = "";
    let bothradio = document.querySelectorAll("input[name=each]");
    if (bothradio[0].checked){
        contributeFreq = "month"
    }
    else if(bothradio[1].checked){
        contributeFreq = "year"
    }
    else {
        contributeFreq = "year"
    }

    let n;
    if(Compound === "annually")  n = 1;
    else if(Compound === "monthly") n = 12;
    else if(Compound === "daily")  n = 365;

    let m = (contributeFreq === "month") ? 12:1;

    let N = Time*m
    if(N==0){
        displayResult(Principle.toFixed(2));
        return;
    }
    
    let i;
    if(Rate=== 0){
        let fv = Principle + Contribution * N;
        displayResult(fv.toFixed(2))
        return
    }
    else{
        i = Math.pow(1+Rate/n , n/m) -1
    }

    let fv_principle = Principle * Math.pow(1 + i, N)

    let fv_contribute = 0;
    if(Contribution > 0){
        let ordinary = Contribution * (Math.pow(1+i, N) -1) /i;
        fv_contribute = (contributeAt === "end") ? ordinary : ordinary * (1+i);
    }
    let totalFV = fv_principle + fv_contribute;
    displayResult(totalFV.toFixed(2))

}

function displayResult(value){
    let historycontent = sessionStorage.setItem("previous", value);
    let result = document.querySelector("#result")
    result.style.display = "block";
    result.innerHTML = "<h2>The Result is " + value;
}


