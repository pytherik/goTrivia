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

$("#multiple").click(() => {
  $(".form-container.multiple").show();
  $(".form-container.trueFalse").hide();
})
$("#single").click(() => {
  $(".form-container.multiple").hide();
  $(".form-container.trueFalse").show();
})

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
$("#new-quest").click(() => {
  // $(".answer").css("backgroundColor", "#444");
  // $(".answer").removeClass("okay");
  $(".answer").removeClass("okay yes no");
  $.get("/api/quests", quest => {
    if (quest.isMultiple) {
      let answers = quest.wrong_answers;
      answers.push(quest.right_answer);
      answers = shuffleArray(answers);
      console.log(answers);
      $(".question").html(`<h1>${quest.question}</h1>`)
      answers.forEach((answer, i) => {
        $("#answer" + i).text(answer);
        if (answer == quest.right_answer) {
          $("#answer" + i).addClass("okay")        }
        $("#answer" + i).click((e) => {
          const guess = e.target.innerHTML;
          if (guess == quest.right_answer) {
            $("#answer" + i).addClass("yes");
            // $("#answer" + i).css("backgroundColor", "green");
            console.log("Richtig");
          }
          else {
            $("#answer" + i).addClass("no");
            // $("#answer" + i).css("backgroundColor", "red");
            $(".okay").addClass("yes");
            // $(".okay").css("backgroundColor", "green");
            console.log("Falsch");
          }
        })
      })

    } else {
      $(".quest-container").html(`<h1>${quest.question}</h1>
      <p>Richtig oder Falsch?</p>`)
    }
  })
})

function checkVal(val) {
  console.log(val);
}