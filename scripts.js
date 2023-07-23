let task = ''
let date = ''
let prior = 'low'
let category = ''
allTasks = JSON.parse(localStorage.getItem('sasa')) || []
let id = 0

allTasks.forEach(element => {
    id = element.id>id?element.id:id;
});
id++;

render_list();

function update_input(){
    task = document.getElementById('newtask').value;
}

function update_due(){
    date = document.getElementById('due_date').value;
}

function update_category(){
    category = document.getElementById('category').value;
}

function update_prior(){
    prior = document.getElementById('prior').value
}

function sort_by(){
    let sort_b = document.getElementById('sort_by').value
    if(sort_b == 'due_date'){
        allTasks.sort((x, y)=>{
            return new Date(x.date) - new Date(y.date)
        })
    } 
    else if(sort_b == 'priority'){
        allTasks.sort((x, y)=>{
            let x1 = x.prior==='low'?3:x.prior==='medium'?2:1;
            let y1 = y.prior==='low'?3:y.prior==='medium'?2:1;
            return x1-y1 
        })
    }
    render_list();
}

function dele(){
    document.getElementById("tasks").innerHTML = ''
}

function delete_task(del){
    var taskall = JSON.parse(localStorage.getItem('sasa'))
    allTasks = allTasks.filter((ele)=>{
        return ele.id !== del
    });
    taskall = taskall.filter((ele)=>{
        return ele.id !== del
    });
    localStorage.setItem('sasa', JSON.stringify(taskall))
    render_list();
}
function delete_subtask(main_id, sub_id){
    var pal = []
    allTasks.forEach((ele)=>{
        if(main_id == ele.id){
            pal = ele.subtask
        }
    })
    pal = pal.filter((ele)=>{
        return ele.id !== sub_id;
    })
    for(let i=0; i<allTasks.length; i++){
        if(allTasks[i].id == main_id){
            allTasks[i].subtask = pal
        }
    }
    taskall = JSON.parse(localStorage.getItem('sasa'))
    for(let i=0; i<taskall.length; i++){
        if(taskall[i].id == main_id){
            taskall[i].subtask = pal
        }
    }
    localStorage.setItem('sasa', JSON.stringify(taskall))
    render_list()
}

function ismarked(i){
    var taskall = JSON.parse(localStorage.getItem('sasa'))
    allTasks[i].isdone = allTasks[i].isdone?false:true;
    taskall.forEach((ele)=>{
        if(ele.id === allTasks[i].id){
            ele.isdone = ele.isdone?false:true
        }
    })
    localStorage.setItem('sasa', JSON.stringify(taskall))
    render_list();
}

function edit_input(i){
    allTasks[i].tas = document.getElementById(`edit_task${allTasks[i].id}`).value
    var taskall = JSON.parse(localStorage.getItem('sasa'))
    taskall.forEach((ele)=>{
        if(ele.id === allTasks[i].id){
            ele.tas = allTasks[i].tas
        }
    })
    localStorage.setItem('sasa', JSON.stringify(taskall))
}
// function edit_subinput(j, i){
//     console.log(allTasks[i].subtask[j])
//     allTasks[i].subtask[j] = document.getElementById(`edit_subtask${allTasks[i].subtask[j].id}+${allTasks[i].id}`).value
//     var taskall = JSON.parse(localStorage.getItem('sasa'))
//     taskall.forEach((ele)=>{
//         if(ele.id === allTasks[i].id){
//             pal = ele.subtask
//             console.log(pal[0].id)
//         }
//     })
//     localStorage.setItem('sasa', JSON.stringify(taskall))
// }

function start_change(){
    let start_date = document.getElementById('start_date').value
    document.getElementById('end_date').min = start_date
}

function end_change(){
    let end_date = document.getElementById('end_date').value
    document.getElementById('start_date').max = end_date
}

function filter_all(){
    allTasks = JSON.parse(localStorage.getItem('sasa'))
    let start_date = document.getElementById('start_date').value
    let end_date = document.getElementById('end_date').value
    let category_filter = document.getElementById('category_filter').value
    let priority_filter = document.getElementById('priority_filter').value
    if(start_date.length > 0){
        allTasks = allTasks.filter((ele)=>{
            return new Date(ele.date) >= new Date(start_date)
        })
    }
    if(end_date.length > 0){
        allTasks = allTasks.filter((ele)=>{
            return new Date(ele.date) <= new Date(end_date)
        })
    }
    if(category_filter.length > 0){
        allTasks = allTasks.filter((ele)=>{
            return ele.category === category_filter
        })
    }
    if(priority_filter != 'all'){
        allTasks = allTasks.filter((ele)=>{
            return ele.prior === priority_filter
        })
    }
    render_list()
}

function view_backlog(){
    allTasks = JSON.parse(localStorage.getItem('sasa'))
    allTasks = allTasks.filter((ele)=>{
        return new Date(ele.date) < new Date()
    })
    render_list();
}

function view_alltasks(){
    allTasks = JSON.parse(localStorage.getItem('sasa'))
    render_list();
}

function render_list(){
    dele();
    for(let i=0; i<allTasks.length; i++){
        let new_div = document.createElement('div')
        new_div.id = "task"
        let newww_div = document.createElement('div')
        newww_div.id = "ksat"
        
        let new_checkbox = document.createElement('input')
        new_checkbox.id = "check_box"
        new_checkbox.type = 'checkbox'
        new_checkbox.checked = allTasks[i].isdone
        new_checkbox.onchange = function(){ismarked(i)}
        let new_span = document.createElement('span')
        new_span.id = "taskname"
        new_span.innerHTML = allTasks[i].tas
        let new_button_edit = document.createElement('button')
        new_button_edit.className = "edit"
        new_button_edit.innerHTML = "Edit"
        new_button_edit.onclick = function(){
            task = allTasks[i].tas
            ide = allTasks[i].id
            this.parentElement.innerHTML = `
            <input type="text" oninput={edit_input(${i})} class="edit_ta" id="edit_task${ide}">
            <button id="save" onclick={render_list()}>Save</button>
            `
            document.getElementById(`edit_task${ide}`).value = task
        }
        let add_subtask = document.createElement('button')
        add_subtask.id = "add_new_subtask"
        add_subtask.innerHTML = "Add subtask"
        add_subtask.onclick = function(){
            ide = allTasks[i].id
            this.parentElement.innerHTML = `
            <input type="text" class="edit_ta" id="input_id">
            <button id="save" onclick={new_subtask(${i})}>Add</button>
            `
            document.getElementById(`input_id`).placeholder = "Add subtask"
        }
        let new_button_del = document.createElement('button')
        new_button_del.className = "delete"
        new_button_del.innerHTML = "Del"
        new_button_del.onclick = function(){delete_task(allTasks[i].id)}
        new_div.appendChild(new_checkbox)
        new_div.appendChild(new_span)
        new_div.appendChild(new_button_edit)
        new_div.appendChild(add_subtask)
        new_div.appendChild(new_button_del)
        newww_div.appendChild(new_div)
        sub_ts = allTasks[i].subtask
        for(let j=0; j<sub_ts.length; j++){
            let new_di = document.createElement('div')
            new_di.id = 'sub_tak'
            let new_subspan = document.createElement('span')
            new_subspan.id = "subtaskname"
            new_subspan.innerHTML = `subtask ${j+1} : ${sub_ts[j].sub}`
            new_di.appendChild(new_subspan)
            // let new_subtask_edit = document.createElement('button')
            // new_subtask_edit.className = "edit"
            // new_subtask_edit.innerHTML = "Edit"
            // new_subtask_edit.onclick = function(){
            //     ide = allTasks[i].id
            //     ida = sub_ts[j].id
            //     this.parentElement.innerHTML = `
            //     <input type="text" oninput={edit_subinput(${j},${i})} class="edit_ta" id="edit_subtask${ida}+${ide}">
            //     <button id="save" onclick={render_list()}>Save</button>
            //     `
            //     document.getElementById(`edit_subtask${ida}+${ide}`).value = sub_ts[j].sub
            // }
            // new_di.appendChild(new_subtask_edit)
            let new_subtask_del = document.createElement('button')
            new_subtask_del.className = "delete"
            new_subtask_del.innerHTML = "Del"
            new_subtask_del.onclick = function(){delete_subtask(allTasks[i].id, sub_ts[j].id)}
            new_di.appendChild(new_subtask_del)
            newww_div.appendChild(new_di)
        }
        document.getElementById('tasks').appendChild(newww_div)
    }
}

function Add_task(){
    // console.log(new Date())
    if(task.length === 0){
        alert("Add task")
    }
    else if(date.length === 0){
        alert("Add due date")
    }
    else if(category.length === 0){
        alert("Add category")
    }
    else{
        allTasks = JSON.parse(localStorage.getItem('sasa')) || []
        allTasks.push({tas:task, id:id, date:date, prior:prior, isdone:false, category:category, count_sub:0, subtask:[]});
        id++;
        task = ''
        date = ''
        category = ''
        prior = 'low'
        document.getElementById('newtask').value = ''
        document.getElementById('due_date').value = ''
        document.getElementById('prior').value = 'low'
        document.getElementById('sort_by').value = 'none'
        document.getElementById('category').value = ''
        localStorage.setItem('sasa', JSON.stringify(allTasks))
    }
    render_list();
}

function new_subtask(i){
    let sub = document.getElementById('input_id').value
    if(sub.length === 0){
        alert("Add Subtask")
    }
    else{
        allTasks[i].subtask.push({id:allTasks[i].count_sub, sub:sub})
        allTasks[i].count_sub++;
        localStorage.setItem('sasa', JSON.stringify(allTasks))
    }
    render_list()
}
