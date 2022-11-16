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

// $("#multiple").click(() => {
//   $("#newQuest").hide();
//   $(".form-container.multiple").show();
//   $(".form-container.trueFalse").hide();
// })
// $("#single").click(() => {
//   $("#newQuest").hide();
//   $(".form-container.multiple").hide();
//   $(".form-container.trueFalse").show();
// })

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
$("#new-quest").click(() => {
  $(".answer").removeClass("okay yes no");
  $.get("/api/quests", quest => {
    let answers = quest.wrong_answers;
    answers.push(quest.right_answer);
    answers = shuffleArray(answers);
    console.log(answers);
    $(".question").html(`<h1>${quest.question}</h1>`)
    answers.forEach((answer, i) => {
      $("#answer" + i).text(answer);
      if (answer == quest.right_answer) {
        $("#answer" + i).addClass("okay")
      }
      $("#answer" + i).click((e) => {
        const guess = e.target.innerHTML;
        if (guess == quest.right_answer) {
          $("#answer" + i).addClass("yes");
          console.log("Richtig");
        }
        else {
          $("#answer" + i).addClass("no");
          $(".okay").addClass("yes");
          console.log("Falsch");
        }
      })
    })
  })
})

function checkVal(val) {
  console.log(val);
}