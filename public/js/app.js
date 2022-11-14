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
  $.get("/api/quests", quest => {
    if (quest.isMultiple) {
      let answers = quest.wrong_answers;
      answers.push(quest.right_answer);
      answers = shuffleArray(answers);
      $(".quest-container").html(`<h1>${quest.question}</h1>
    <p>${answers}<p>`)
    } else {
      $(".quest-container").html(`<h1>${quest.question}</h1>
      <p>Richtig oder Falsch?</p>`)
    }
  })
})