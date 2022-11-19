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

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
$("#new-quest").click(() => {
  $(".edit").empty();
  $(".greeting").hide();
  $(".quest-container").show();
  $(".answer").removeClass("okay yes no");
  $.get("/api/quests", quest => {
    // if (quest.isAuthor) {
    //   $(".edit").append(`<button class='btn-small' id='edit'>
    //   <a href="/quest/edit/${quest._id}"<a>
    //   bearbeiten</button>`);
    // }
    let answers = quest.wrong_answers;
    answers.push(quest.right_answer);
    answers = shuffleArray(answers);
    if (quest.isAuthor) {
      $(".question").html(`
      <a id="edit-quest" href="/quest/edit/${quest._id}">
        <span class="question-header">${quest.question}</span><span id="ed-icon">🖊️</span>
      </a>`);
    } else {
      $(".question").html(`<span class="question-header">${quest.question}</span>`)
    }

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
