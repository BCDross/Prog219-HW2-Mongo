function ToDo(pTitle, pDetail, pPriority, pCompleted) {
  this.title = pTitle;
  this.detail = pDetail;
  this.priority = pPriority;
  this.completed = pCompleted;
}
var ClientToDos = []; // Array for edits if needed

function compare(a, b) {
  if (a.completed == false && b.completed == true) {
    return -1;
  }
  if (a.completed == true && b.completed == false) {
    return 1;
  }
  return 0;
}

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("submit").addEventListener("click", function () {
    var tTitle = document.getElementById("title").value;
    var tDetail = document.getElementById("detail").value;
    var tPriority = document.getElementById("priority").value;
    var tCompleted = false;
    
    var completed = (document.getElementById("completed").value).toUpperCase();
    if (completed == "YES") {
        tCompleted = true;
    }

    var oneToDo = new ToDo(tTitle, tDetail, tPriority, tCompleted);
    ClientNotes.sort(compare);
    $.ajax({
      url: "/NewToDo",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(oneToDo),
      success: function (result) {
        console.log("added new note");
      },
    });
  });

  document.getElementById("get").addEventListener("click", function () {
    var listDiv = document.getElementById("listDiv");
    listDiv.innerHTML = "";

    var ul = document.createElement("ul");

    // AJAX get
    $.get("/ToDos", function (data, status) {
      ClientNotes = data; // put the returned server json data into our local array
      listDiv.appendChild(ul);
      ClientNotes.forEach(ProcessOneToDo); // build one li for each item in array
      function ProcessOneToDo(item, index) {
        var li = document.createElement("li");
        ul.appendChild(li);

        li.innerHTML =
          li.innerHTML +
          index +
          ": " +
          " Priority: " +
          item.priority +
          "  " +
          item.title +
          ":  " +
          item.detail +
          " Completed?: " +
          item.completed;
      }
    });
  });

  document.getElementById("update").addEventListener("click", function () {
    
    let whichToUpdate = document.getElementById("toUpdate").value.toUpperCase();
    let idToUpdate = "";
    for(let i = 0; i < ClientNotes.length; i++){
        if(ClientNotes[i].title.toUpperCase() === whichToUpdate) {
            idToUpdate = ClientNotes[i]._id;
        }
    }

    if(idToUpdate != null){
        $.ajax({
            url: 'UpdateToDo/',
            type: 'PUT',
            contentType: 'application/json',
            data:JSON.stringify({id: idToUpdate}),
            success: function (response) {
                console.log(response);
            },
            error: function() {
                console.log("Error in Update Operation")
            }
        })
    }
  });

  document.getElementById("delete").addEventListener("click", function () {
    var whichToDo = document.getElementById("deleteTitle").value;
    var idToDelete = "";
    for (i = 0; i < ClientNotes.length; i++) {
      if (ClientNotes[i].title === whichToDo) {
        idToDelete = ClientNotes[i]._id;
      }
    }

    if (idToDelete != "") {
      $.ajax({
        url: "DeleteToDo/" + idToDelete,
        type: "DELETE",
        contentType: "application/json",
        success: function (response) {
          console.log(response);
        },
        error: function () {
          console.log("Error in Delete Operation");
        },
      });
    } else {
      console.log("no matching Subject");
    }
  });
});
