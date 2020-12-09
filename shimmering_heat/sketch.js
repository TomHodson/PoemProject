const FADE_TIME = 30000; //in milliseconds
const START_DELAY = 1000;
const GEN_FRAMERATE = 10;

let background_color = "#59115c00";
let textcolor = '#FFFFFF'

let poem_div, hidden_poem, words, nwords, br;


let position = 0;
let errorchance = 0;
let words_so_far = 0;
let line = 0;
let word = 0;
let npoem = 0;
let next;


function setup() {
  select('#hidden_poem').style('display', 'none');  
    
  createCanvas(windowWidth, windowHeight);
  background_color = color(background_color);
  background_color.setAlpha(0);
  background(background_color);
  
  //frameRate(20); //Only update once every few seconds
  colorMode(HSL);
  poem = select('#poem-div').elt;
  poem.appendChild(document.createElement('br'));
  hidden_poem = select('#hidden_poem').elt;
  nwords = hidden_poem.childNodes.length;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(background_color);
}

function draw() {
  if(millis() < FADE_TIME) {background_color.setAlpha(255 * min(millis() / FADE_TIME, 1));}
  background(background_color); 
    
  //delay starting the sandpiles for a bit and keep the framerate high to get a smooth animation at the begining
  if(millis() < START_DELAY) {frameRate(30);}
  else {
  frameRate(GEN_FRAMERATE);
  //add line breaks for the sonnet lines
  if(word == 0 && (line == 4 || line == 9 || line === 14 || line === 17)) {
    next = document.createElement('br');
  }
  else {
    next = hidden_poem.childNodes[position].cloneNode(true);
    print(position, next)
    next.style.color = textcolor;
  }
  poem.appendChild(next);
  
  //if there's a line break, increment the line number and reset the word number to 0
  if(next.nodeName === 'BR' | word > 10) {
    line += 1;
    word = 0;
  }
  
  
  //we've printed out a whole poem
  if(line == 17) {
    words_so_far = 0;
    errorchance += 0.2;
    //if(npoem === 0) errorchance  = 0;
    //if(npoem === 1) errorchance  = 0.2;
    //if(npoem === 2) errorchance  = 1;
    line = 0;
    word = 0;
    position = 0;
    npoem += 1;
    poem.appendChild(document.createElement('br'))
    
    let hline = document.createElement('hr');
    poem.appendChild(hline);
    //hline.scrollIntoView();
    
    //pause 5 seconds
    frameRate(0.5);
    if(npoem == 3) noLoop();
  }
  else if(random() < errorchance) {
    textcolor = color(random(255), min(100, 200 * errorchance), max(200, 255 - 100 * errorchance));
    position = floor(random(nwords));
  }
  else {
    position = (position + 1) % nwords;
  }
  words_so_far += 1;
}
}