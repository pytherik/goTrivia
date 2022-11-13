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