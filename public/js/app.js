//: Show, hide Menu-Modal

$(document).ready(() => { $(".menu-modal").hide() });
$(".menu").click(() => {
  $(".menu-modal").show();
  $(".menu").hide();
  $(".menu.back").show();
})
$(".back").click(() => {
  $(".menu-modal").hide();
  $(".menu").show();
  $(".menu.back").hide();
})

//: Shuffle Funktion für Antworten

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

//: neue Frage (Button 'next')

$("#new-quest").click(() => {
  let time = 15;
  let score = 0;  //* Anfangszustand herstellen ↓↓↓
  $(".question").removeClass("won lost");
  $("#new-quest").hide();
  $("#timer").text("15");
  $(".edit").empty();
  $(".greeting").hide();
  $(".quest-container").show();
  $(".answer").removeClass("okay yes no");

  //: ajax Datenbankabfrage in routes/api/quests.js
  $.get("/api/quests", quest => {  
    let num_vetos = '';
    quest.veto.length > 0 ? num_vetos = quest.veto.length : num_vetos = '';

    let answers = quest.wrong_answers;
    answers.push(quest.right_answer);
    answers = shuffleArray(answers);
          
    //: Autor darf editieren
    if (quest.isAuthor) {          
      $(".question").html(`
      <a id="edit-quest" href="/quest/edit/${quest._id}">
        <span class="question-header">${quest.question}</span>
        <span id="ed-icon">🖊️${num_vetos}</span>       
      </a>`);                                    //* Vetos anzeigen
    } else {
      $(".question").html(`
      <a id="edit-quest" href="/quest/veto/${quest._id}">
        <span class="question-header">${quest.question}</span>
        <span id="ed-icon">☝🏻${num_vetos}</span>       
      </a>`);                                    //* Vetos anzeigen
    }

    answers.forEach((answer, i) => {
      $("#answer" + i).text(answer);
      if (answer == quest.right_answer) {
        $("#answer" + i).addClass("okay")
      }
      $("#answer" + i).click((e) => {
        clearInterval(count);  //* Countdown stoppen
        $("#new-quest").show();
        const guess = e.target.innerHTML;
        //: richtige Antwort
        if (guess == quest.right_answer) {        
          $("#timer").text(`Glückwunsch! ${time} Punkte!`);
          $("#answer" + i).addClass("yes");
          $(".question").addClass("won");
          score = time;
          console.log("Richtig");
          console.log("Score: ", score);
          //: update Scoring
          $.ajax({                              
            url: `/api/quests/score/${score}`,
            type: "PUT",
            success: console.log("success")
          });
        }
        //: falsche Antwort
        else {
          $("#answer" + i).addClass("no");       
          $(".question").addClass("lost");
          $("#timer").text("verloren!")
          $(".okay").addClass("yes");
          console.log("Falsch");
        }
      })
    })
    console.log("Score: ", score);

    //: Countdown Funktion
    const countdown = () => {    //* Start: neue Frage
      time--;
      $("#timer").text(`${time}`)
      if (time == 0) {
        $("#new-quest").show();
        $(".okay").addClass("yes");
        $(".question").addClass("lost");
        $("#timer").text("verkackt!");
        clearInterval(count);
      }
    }
    const count = setInterval(countdown, 1000);
  })
})
