document.addEventListener("DOMContentLoaded", function(){

let newGoalName = document.querySelector("#new-goal-name");
let newGoalAmount = document.querySelector("#new-goal-amount");
let newGoalSubmit = document.querySelector("#new-goal-submit");

let goalNames = document.getElementById("goals-names");

let goalList = document.querySelector(".goals-list")
let noGoals = document.querySelector("#no-goals")

const STORAGE_KEY = "goals";

function getGoals(){
    try{
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }
    catch(e){
        console.error("Could not parse Goals from storage", e);
        return [];
    }
}

function saveGoals(goalsArray){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goalsArray))
}

function renderGoals(){
    let goals = getGoals();
    goalNames.innerHTML = ""

    if(goals.length === 0){
        let p = document.createElement("p")
        p.id = "no-goals";
        p.textContent = "No Goals added Yet. Start Tracking!"
        goalNames.appendChild(p)
        return
    }

    goals.forEach(g =>{
        let card = document.createElement("div")
        card.className = "goal-card";
        let title = document.createElement("div")
        title.textContent = `Goal: ${g.name}`;

        let amounts = document.createElement("div");
        let current = +(g.current || 0);
        let target = +g.amount;
        amounts.textContent = `${current.toFixed(2)} / ${target.toFixed(2)}`;

        let progress = document.createElement("div")
        progress.className = "progress-bar";
        let fill = document.createElement("div")
        fill.className = "fill";
        let pct = target ? Math.min(100,(current/target)*100) : 0;
        fill.style.width = pct + "%";
        progress.appendChild(fill);

        let actions = document.createElement("div")
        actions.style.marginTop = "8px";

        let depositInput = document.createElement("input")
        depositInput.type = "number"
        depositInput.min = "0.01"
        depositInput.step = "0.01";
        depositInput.placeholder = "Add $"
        depositInput.style.padding = "6px"
        depositInput.style.borderRadius = "6px";

        let depositBtn = document.createElement("button")
        depositBtn.textContent = "+ Add"
        depositBtn.addEventListener("click" , function(){
            let val = parseFloat(depositInput.value)
            if(isNaN(val) || val < 0){
                alert("Enter a valid Positive amount to deposit")
                return;
            }
            addDeposit(g.id, val)
    })
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete"
    deleteBtn.style.marginLeft = "8px"
    deleteBtn.addEventListener("click", function(){
        if(confirm(`Delete Goal "${g.name}"? This cannot be undone.`)){
            deleteGoal(g.id);
        }
    })
    actions.appendChild(depositInput);
    actions.appendChild(depositBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title)
    card.appendChild(amounts)
    card.appendChild(progress)
    card.appendChild(actions);

    goalNames.appendChild(card)

    })
}

function addDeposit(id, amount){
    let goals = getGoals();
    let idx = goals.findIndex(g => g.id === id)
    if(idx === -1) return;
    goals[idx].current = +( (goals[idx].current || 0) + amount).toFixed(2);
    if(goals[idx].current > goals[idx].amount) goals[idx].current = goals[idx].amount;
    saveGoals(goals);
    renderGoals();
}

function deleteGoal(id){
    let goals = getGoals();
    goals = goals.filter(g => g.id !== id);
    saveGoals(goals);
    renderGoals();
}

const existingGoals = getGoals();
renderGoals();

newGoalSubmit.addEventListener("click", function(event){
    let newName = newGoalName.value.trim();
let amount = newGoalAmount.value.trim();



if(!newName || !amount){
    alert("Please fill all fields properly!")
    return
}


let goals = getGoals();
goals.push({
    id: Date.now().toString(),
    name: newName,
    amount: parseFloat(amount),
    current: 0
})
saveGoals(goals)
newGoalName.value = "";
newGoalAmount.value = "";
renderGoals();


newGoalName.value = "";
newGoalAmount.value = "";

if(noGoals){
    noGoals.remove();
}

})

})

