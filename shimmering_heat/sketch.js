const FADE_TIME = 30000; //in milliseconds, how long to make the background fade last, having FADE_TIME >> START_DELAY works best
const START_DELAY = 1000; //how to long to wait before starting the main animation itself
const GEN_FRAMERATE = 20; //how quickly to add words, constrained by the CSS fade animation applied to the words.
const STANZA_PAUSE_TIME = 3; //in seconds, how long to pause between each stanza.
const N_STANZAS = 3; //how many stanzas to generate
const STANZA_BREAKS = [4,9,14,17]; //which lines to put line breaks on
const ERROR_CHANCES = [0, 0.2, 1];
const TEXT_COLORS = ['#ffb1b1', '#ffd5d5', '#FFFFFF'];

const REVEAL_START_DELAY = 5000;
const REVEAL_TIME = 50; //seconds
const POEM_HEIGHT = 1200; //pixels

let background_color = "#59115c00";
let textcolor = TEXT_COLORS[0];

let poem_div, hidden_poem, words, nwords, br;

let position = 0;
let errorchance = ERROR_CHANCES[0];
let words_so_far = 0;
let line = 0;
let word = 0;
let npoem = 0;
let next;

let img;
let canvas;
function preload() {
    img = loadImage('heat.png');
}

function setup() {
  select('#hidden_poem').style('display', 'none');  
    
  canvas = createCanvas(windowWidth, windowHeight);
  //canvas.parent('sketch-holder');  
    
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

function draw_background() {
    background(background_color);
    let proportion = max(0, (millis() - REVEAL_START_DELAY) / 1000 / REVEAL_TIME);
    let targetwidth = 1500;
    let dx = (width - targetwidth)/2;
    
    tint(255, proportion);
    image(img, dx=dx, dy=0, dWidth=targetwidth, dHeight=windowHeight, sx=0, sy=30, sWidth = img.width, sHeight=img.height - 60)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  draw_background();
}

function advance_position() {
    if(random() < errorchance) {
        position = floor(random(nwords));
      }
      else {
        position = (position + 1) % nwords;
      }
}

function draw() {
//   let img = canvas.elt.toDataURL("image/png");
//   let b = document.getElementById("sketch-holder");
//   b.style.backgroundImage = "url(" + img + ")"; 
    
  if(millis() < FADE_TIME) {background_color.setAlpha(255 * min(millis() / FADE_TIME, 1));}
  draw_background();
    
  //delay starting the sandpiles for a bit and keep the framerate high to get a smooth animation at the begining
  if(millis() < START_DELAY) {frameRate(30);}
  else {
      frameRate(GEN_FRAMERATE);
      
      if(line === 0 && word === 0) {print("poem: ", npoem, 'error: ', errorchance);}
      
      //add line breaks for the stanzas and long lines
      //otherwise just get the next word from the poem
      if(word > 10 || (word === 0 && STANZA_BREAKS.includes(line))) {
        print("added a stanza break");
//         poem.appendChild(document.createElement('br'));
        next = document.createElement('br');
      } else {
        //prevent short lines by skipping linebreaks if the line is still too short
        do {
            next = hidden_poem.childNodes[position].cloneNode(true); //get the next word from the poem
            advance_position(); //this usually just does position++ but randomises it sometimes.
        } while(word < 3 && next.nodeName === 'BR'); //skip if the line is short and the word is a linebreak
            
        next.style.color = textcolor;
      }
      
      //if there's a line break in the original poem, we added one, or we randomised to one.
      if(next.nodeName === 'BR') {
        line += 1;
        word = 0;
      }
      else word++;
      
//       print('line:', line, 'pos:', position, 'word:', word, 'next:', next)
      poem.appendChild(next);
      
      //we've printed out a whole poem
      if(line == STANZA_BREAKS[STANZA_BREAKS.length - 1]) {
        line = 0;
        word = 0;
        position = 0;
        npoem += 1;
        errorchance = ERROR_CHANCES[npoem];
        textcolor = TEXT_COLORS[npoem];
        
        //hline.scrollIntoView();
        poem.appendChild(document.createElement('br'));
        noLoop();
        if(npoem < N_STANZAS) {
            setTimeout(loop, STANZA_PAUSE_TIME);
            poem.appendChild(document.createElement('hr'));
            poem.appendChild(document.createElement('br'));
        }
    }
  }
}