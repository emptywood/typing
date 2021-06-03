$(function() {
  //jqueryオブジェクトを変数に代入
  const $yomi = $("#yomi");
  const $mondai = $("#mondai");
  const $finishPanel = $("#finish-panel");
  const $countSelect = $("#count-select");
  const $correctMessage = $("#correct-message");
  const $mistakeMessage = $("#mistake-message");
  const $timeMessage = $("#time-message");
  const $startMessage = $("#start-message");

  //問題用の変数の初期化
  let char_index = 1;
  let max_length = 3; // TODO最初の問題
  let question_number = 1;
  let question_limit = 3;
  let done_questions = {};
  let typing_cnt = 0;
  let correct_cnt = 0;
  let mistake_cnt = 0;
  let start_game = false;
  let start_time = 0;

  //問題
  const MONDAI_LIST = [
    {yomi:"ごはん",text:"gohan"},
    {yomi:"おすし",text:"osushi"},
    {yomi:"サイフ",text:"saifu"},
    {yomi:"バナナ",text:"banana"},
    {yomi:"くつした",text:"kutsushita"},
    {yomi:"なべ",text:"nabe"},
    {yomi:"あし",text:"ashi"},
    {yomi:"パソコン",text:"pasokon"},
    {yomi:"けいたい",text:"keitai"},
    {yomi:"ふとん",text:"futon"},
  ];

  $yomi.hide();
  $mondai.hide();
  changeQuestionWord(getQuestionNumber()); // 最初の問題の設定

  $countSelect.on("change",function(e) {
    question_limit = Number($countSelect.val());
    done_quenstions = {};
    changeQuestionWord(getQuestionNumber());
  });

  $("#start-button").on("click",function(e) {
    init();
  });

  $(document).on("keypress", function(e){
    if(!start_game && e.keyCode === 32) {
      $startMessage.hide();
      $countSelect.hide();
      $yomi.show();
      $mondai.show();
      start_game = true;
      start_time = performance.now();
      return;
    } else if(!start_game) {
      return;
    }

    typing_cnt++;

    // console.log('key:'+e.key);
    const $target = $("#char-"+char_index);
    const char = $target.text();
    if(e.key === char) { //入力文字と現在の位置の文字が一緒だったら
      //alert("正解！");
      $target.removeClass("default");
      $target.addClass("correct");
      char_index++;
      correct_cnt++;
    } else {
      mistake_cnt++;
    }

    if(max_length < char_index) {
      question_number++; //次の問題の用意
      if(question_limit < question_number) {
        finish();
        return;
      }
      changeQuestionWord(getQuestionNumber());
      char_index = 1; // 初期化
    }
  });

  function getQuestionNumber() {
    let random_number = Math.floor(Math.random() * 10);
    while(done_questions[random_number] !== undefined) { // done_questions[random_number]が存在するときは、while内のループ処理を実施する
      random_number = Math.floor(Math.random() * 10);
    }
    done_questions[random_number] = random_number; // 出題済みとしてnumberを格納する
    return random_number;
  }

  function init() { // 初期化
    char_index = 1;
    question_number = 1;
    question_limit = 3;
    done_questions = {};
    typing_cnt = 0;
    correct_cnt = 0;
    mistake_cnt = 0;
    start_game = false;
    start_time = 0;
    $countSelect.val("3");

    changeQuestionWord(getQuestionNumber());

    $finishPanel.addClass("hidden");
    $yomi.hide();
    $mondai.hide();
    $startMessage.show();
    $countSelect.show();
    }
    
  function finish() {
    $finishPanel.removeClass("hidden");
    $yomi.hide();
    $mondai.hide();
    $correctMessage.text('正解数:'+correct_cnt+'/'+typing_cnt+'('+Math.floor(correct_cnt/typing_cnt * 100)+'%)');
    $mistakeMessage.text('間違い数:'+mistake_cnt+'/'+mistake_cnt+'('+Math.floor(mistake_cnt/typing_cnt * 100)+'%)');
    const end_time = performance.now();
    const typing_time = ((end_time - start_time) / 1000).toFixed(2);
    $timeMessage.text('かかった時間:'+typing_time+'秒');
  }

  function changeQuestionWord(index) {
    const word = MONDAI_LIST[index]["text"];
    max_length = word.length;
    let newHtml = "";
    for(var i = 0; i < max_length; i++) {
      newHtml += '<p id="char-'+(i+1)+'" class="text default">'+word[i]+'</p>';
    }
    $mondai.html(newHtml);
    $yomi.text(MONDAI_LIST[index]["yomi"]);
  }
});