let wordOfTheDay = `im the word of the day`;
let inputId;
let numberOfGuessedLetters = 0;
let guessLetterLocation=5;
let notFullWord = true;
let guessedword="";
let inputs = [];
let wordOfTheDayArray = [];
let guessedWordArray = [];
let correctLetters = 0;
let numerOfTries = 0;
let isAValidWord = true;
const endMessage = document.getElementById("pop-up");
endMessage.style.display="none";
//the folowing code gets the word but it doesnt wait for the promise to be resolved before exicuting the rest of the code 
// so it logs wordOfTheDay as 'im the word of the day' so I think I need to use async for this part
/*function getWordOfTheDay(){
    const promise = fetch("https://words.dev-apis.com/word-of-the-day");
    console.log(`here`);
    promise
    .then(function (response){
    const processingPromise = response.json();
    console.log(processingPromise);
    return processingPromise;
    })
    .then(function(processedResponse){
        console.log(processedResponse.word);

    wordOfTheDay = processedResponse.word;
    console.log(wordOfTheDay);
    });
}*/ 

// async as done the same thing as the previous code
async function getWordOfTheDay(){
 const promise = await fetch("https://words.dev-apis.com/word-of-the-day");
 const processedResponse =  await promise.json();
 wordOfTheDay = processedResponse.word;
 wordOfTheDay = wordOfTheDay.toLocaleUpperCase();
 console.log(wordOfTheDay);
 document.querySelector(".loading-Icon").innerText = "";
};
getWordOfTheDay();


for(let i=0; i<=29;i++){
    const n=i+1;
    inputs.push(document.getElementById("input"+n));
};
//console.log(inputs);

function keyGoesDown(keyed){
    //console.log("function keyGoesDown run");
    switch(keyed){
        //this is matching the single letter string of the key press to the a-zA-z and 
        case (keyed.match(/^[a-zA-Z]$/)|| {}).input:
            isALetter(keyed);
            break;
        case "Backspace":
        case "Delete":
            //console.log("im backspace");
            isBackspace(keyed);
            break;
        case "Enter":
            isEnter(keyed);
            //console.log("im enter");
            break;
    };
    //check also works this way but if you want more solutions go to https://stackoverflow.com/questions/2896626/switch-statement-for-string-matching-in-javascript
    /*if(/^[a-zA-Z]$/.test(keyed)){  
        isALetter(keyed);
        //console.log("letter test done");
    }else{
        console.log("not a letter");
        console.log(keyed);
    };*/
};

function isALetter(letter){
    inputs[numberOfGuessedLetters].innerText = letter;
    inputs[numberOfGuessedLetters].innerText=inputs[numberOfGuessedLetters].innerText.toLocaleUpperCase();
    if(notFullWord === true){
        //console.log(notFullWord);
        numberOfGuessedLetters++;
    };
};

function isBackspace(){
    notFullWord= true;
    //moving input location
    if(numberOfGuessedLetters === 5
        || numberOfGuessedLetters === 10
        ||numberOfGuessedLetters === 15
        ||numberOfGuessedLetters === 20
        ||numberOfGuessedLetters === 25){
        //console.log("im 5,10,15,20,25");
    }else if(inputs[numberOfGuessedLetters].innerText==="" && numberOfGuessedLetters>0){
        numberOfGuessedLetters--;
    }else if(numberOfGuessedLetters ===4
        ||numberOfGuessedLetters === 9
        ||numberOfGuessedLetters === 14
        ||numberOfGuessedLetters === 19
        ||numberOfGuessedLetters === 24
        ||numberOfGuessedLetters=== 29){
        //console.log("im 4,9,14,19,24,29")
    };
    inputs[numberOfGuessedLetters].innerText="";
    //console.log(numberOfGuessedLetters);
};

function isEnter(){
    //console.log(numberOfGuessedLetters);
    if(inputs[numberOfGuessedLetters].innerText != ""){
        document.querySelector(".loading-Icon").innerText = "\uD83C\uDF00";
        guess();
        if (notFullWord===false){
            numberOfGuessedLetters++;
            notFullWord = true;
        };
    };
};

function guess(){
    switch(inputs[numberOfGuessedLetters]){
        case inputs[4]:
        case inputs[9]:
        case inputs[14]:
        case inputs[19]:
        case inputs[24]:
        case inputs[29]:
            makeWord();
            makeArrays();
            isAWord();
            break;

    };
};

function makeWord(){
    guessedword = inputs[numberOfGuessedLetters-4].innerText+inputs[numberOfGuessedLetters-3].innerText+inputs[numberOfGuessedLetters-2].innerText+inputs[numberOfGuessedLetters-1].innerText+inputs[numberOfGuessedLetters].innerText;
    //console.log(guessedword);
    let cycle = numberOfGuessedLetters-4;
    for(let i=0;i<5;i++){
        if(inputs[cycle].classList.contains("not-a-word")){
            inputs[cycle].classList.remove("not-a-word");
        }
        cycle++;
    };
};

async function isAWord(){
    const promise = await fetch("https://words.dev-apis.com/validate-word",{
        method:"POST",
        body: JSON.stringify({word: guessedword})
    });
    const processedResponse = await promise.json();
    isAValidWord= processedResponse.validWord;
    console.log(isAValidWord);
    if(isAValidWord===false){
        let cycle = numberOfGuessedLetters-5;
        for(let i=0;i<5;i++){
            //this doesnt behave the way i thought it would removing a class and adding a class witin te same function does reload it in te browser
            /*if(inputs[cycle].classList.contains("not-a-word")){
                inputs[cycle].classList.remove("not-a-word");
            }*/
            inputs[cycle].classList.add("not-a-word");
            cycle++;
        };
        numberOfGuessedLetters--;
    }else{
        wordTest();
        numerOfTries++;
    };
    document.querySelector(".loading-Icon").innerText = "";
    winOrLose();
};


function makeArrays(){
    //testing 2 differnt ways to make arrays for excisting strings
    wordOfTheDayArray = wordOfTheDay.split(``);
   // console.log(wordOfTheDayArray);
    guessedWordArray = Array.from(guessedword);
    //console.log(guessedWordArray);

};

//using .splice(i,1) is breaking the for loop as it does stay equal lengths

function wordTest(){
    guessLetterLocation = numberOfGuessedLetters;
    guessLetterLocation = guessLetterLocation-5;
    for (let i=0; i<guessedWordArray.length; i++){
        if (guessedWordArray[i] === wordOfTheDayArray[i]){
            //console.log(guessedWordArray[i]," is in the right postion and letter")
            //wordOfTheDayArray.splice(i,1);
            wordOfTheDayArray[i]="";
            correctLetters++;
            inputs[guessLetterLocation].classList.add("correct-letter");
        }else{
            inputs[guessLetterLocation].classList.add("no-letter");
        };
        guessLetterLocation++;
    };
    guessLetterLocation = guessLetterLocation-5;
    for (let i=0; i<guessedWordArray.length; i++){
        for(let n=0;n<wordOfTheDayArray.length;n++){
            if (guessedWordArray[i] === wordOfTheDayArray[n]){
                //console.log(guessedWordArray[i]," is in the word of the day");
                //wordOfTheDayArray.splice(n,1);
                wordOfTheDayArray[n] ="";
                inputs[guessLetterLocation].classList.add("wrong-location");
                //if I known break existed my code would be very diiffferent
                break
            };
            //console.log(wordOfTheDayArray);
        };
        guessLetterLocation++;
    };
};

function winOrLose(){
    console.log(numberOfGuessedLetters);
    if(correctLetters===5){
        document.querySelector(".end-message").innerText = "You Win"
        endMessage.style.display="flex";
        document.querySelector(".game-end").classList.add("game-end-ani");
        document.querySelector(".title").classList.add("rainbow");
    }else if(numerOfTries===6){
        endMessage.style.display="flex";
        document.querySelector(".game-end").classList.add("game-end-ani");
        document.querySelector(".end-message").innerText = "You Lose"
    }else{
        correctLetters=0;
    };
};

function inputTest(){
    switch(inputs[numberOfGuessedLetters]){
        case inputs[4]:
        case inputs[9]:
        case inputs[14]:
        case inputs[19]:
        case inputs[24]:
        case inputs[29]:
            notFullWord = false;
            //console.log(notFullWord);
            //console.log("should be a guess");
            break;
    };
};

document
.querySelector(".body")
.addEventListener("keydown", function(event){
    if( endMessage.style.display === "none"){
        inputTest();
        //console.log(inputId);
        //console.log(event.key);
        keyGoesDown(event.key);
    }
});
