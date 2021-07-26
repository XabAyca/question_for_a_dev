let turn  = 0 
let point = 0
let select = 0
let questionsSaved = undefined
const questionEl = document.getElementById('questions')
const answersEl  = document.getElementById('answers')
const title      = document.getElementsByTagName('header')[0]

startGame = () => {
  const select = document.getElementById('select').value.split(' ')[0]
  saveSelect(select)
  fetch(`https://opentdb.com/api.php?amount=${select}`)
  .then((response) => response.json())
  .then((response) => {
    saveQuestionsAnswers(response);
    turns(response,select)
  })
  .catch((error) => console.error(error));
}

saveSelect= (selectAnswer)=>{
  return select = selectAnswer
}

saveQuestionsAnswers = (questions)=>{
  questionsSaved = questions
}

turns = (questions,select) =>{
  title.innerHTML = `<h1>Questions ${turn+1}/${select}</h1>`

  questionEl.innerHTML=''
  answersEl.innerHTML =''
  // saveQuestionsAnswers(questions)
  for(let i=0;i<questions.results.length;i++) {
    let questionsArray =[]
    questions.results[i].incorrect_answers.forEach(answer => {
      questionsArray.push(`<a value='incorrect' ">${answer}</a>`)
    })
    questionsArray.push(`<a value='correct' ">${questions.results[i].correct_answer}</a>`)
    arrayShuffle(questionsArray)
    questionEl.innerHTML += `<div id='question${i}'class='hidden'><h3>${questions.results[i].question}</h3></div>`
    answersEl.innerHTML  += `
    <div id='answers${i}' class='block-answer hidden'>
      <div class='answer-list'>
        ${questionsArray[0]}
        ${questionsArray[1]}
      </div>  
      <div class='answer-list'>
        ${questionsArray[2]}
        ${questionsArray[3]}
        </div>
      </div>
    </div>
  `
  };
  const allAnswers = document.querySelectorAll('section a');
  allAnswers.forEach(answer => {
    answer.addEventListener('click', (event) =>{
      nextTurn(event)
    })
  });
  
  const question   = document.getElementById(`question0`)
  const answers    = document.getElementById(`answers0`)
  question.classList.remove('hidden')
  answers.classList.remove('hidden')
}

arrayShuffle = (array) => {
  return array.sort((a, b) => 0.5 - Math.random());
}

answer = (event) =>{
  const answerEl = event.target
  if(event.srcElement.attributes[0].value == 'correct'){
    answerEl.classList.add('correct-answer')
    point += 1
  }else{
    answerEl.classList.add('wrong-answer')
  }
}

nextTurn = (event)=>{
  const answerA = event.srcElement.attributes[0].value;
  answer(event);
  turn += 1;
  setTimeout(()=>{
    if(turn == select){
      endGame()
    }else{
      const question = document.getElementById(`question${turn}`)
      const answers = document.getElementById(`answers${turn}`)
      const beforeQuestion = document.getElementById(`question${turn-1}`)
      const beforeAnswers = document.getElementById(`answers${turn-1}`)
      title.innerHTML = `<h1>Questions ${turn+1}/${select}</h1>`;
      beforeAnswers.classList.add('hidden');
      beforeQuestion.classList.add('hidden');
      answers.classList.remove('hidden');
      question.classList.remove('hidden');
    }
  },1000)
}

endGame =() =>{
  title.innerHTML='<h1>The game is OVER</h1>'
  questionEl.innerHTML=`<h3>Your score is ${point}/${select}</h3>`
  answersEl.innerHTML=`
  <div class='end-game'>
    <div class='astro'>
      <i class="fas fa-user-astronaut fa-7x"></i>
    </div>
    <div>
      <a href='#all-responses' id=result onclick='allResponses()'> See answers ></a>
      <a id=result onclick='initialisation()'> New Game ></a>
    </div>
  </div>
    `
}

allResponses = () => {
  questionsSaved.results.forEach(question =>{
    answersEl.innerHTML+=`
    
    <div id='all-responses'>
      <h3>${question.question}</h3>
      <a>${question.correct_answer}</a>
    </div>
    <hr>
  `
  })
  const list=document.querySelectorAll('#all-responses>h3,#all-responses>a,#all-responses>hr')
  list.forEach(el =>{
    observer.observe(el)
  })
}

initialisation = ()=>{
  turn  = 0 
  point = 0
  select = 0
  questionsSaved = undefined
  title.innerHTML=`<h1>Questions for a Dev</h1>`
  questionEl.innerHTML=`<h3>How many questions do you want to answer today ?</h3>`
  answersEl.innerHTML=`
  <div class='block-select'>
    <form action="" method="get" onchange="startGame()">
      <select name="select" id="select">
        <option value="">-- Please choose an option --</option>
        <option value="5 questions">5</option>
        <option value="10 questions">10</option>
        <option value="15 questions">15</option>
        <option value="20 questions">20</option>
      </select>
    </form>
  </div>    
  `
}
initialisation()

// Intersection observer
let options = {
  rootMargin: '0px',
  threshold: [0, 0.25, 0.5, 0.75, 1]
}

function intersectionCallback(entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio ===  0) {
      entry.target.style.opacity="0";
    } else if (entry.intersectionRatio > 0 && entry.intersectionRatio < 0.25) {
      entry.target.style.opacity="0.25";
    } else if (entry.intersectionRatio >= 0.25 && entry.intersectionRatio < 0.5) {
      entry.target.style.opacity="0.5";
    } else if (entry.intersectionRatio >= 0.5 && entry.intersectionRatio < 0.75) {
      entry.target.style.opacity="0.75";
    } else if (entry.intersectionRatio >= 0.75) {
      entry.target.style.opacity="1";
    }
  });
};

let observer = new IntersectionObserver(intersectionCallback, options);




