let poem_div, words, nwords;

function fixCapitalisation(arr, i) {
  //try to make the capitalisation of the word labelled by i make sense in context.
  let word = arr.childNodes[i].innerText
  let capitalise = false;
  
  //if it's the start of the poem, make it capitalised.
  if(i === 0) capitalise = true;
  else {
    //go backwards to find the previous thing that's a word, not a space or linebreak
    let j = i;
    do {j = j - 1}
    while(j >= 0 && arr.childNodes[j].nodeName !== 'SPAN')
    
    if(j === -1) {
      capitalise = true;
    }
    else {
        //check if the previous word ends with a full stop
        let prevWord = arr.childNodes[j].innerText
        if(prevWord[prevWord.length - 1] === '.') capitalise = true;
    }

  }
  //arr.childNodes[i].innerText = word;
}

function swap(arr, i, j) {
  let l = arr.childNodes;
  let a = min(i,j);
  let b = max(i,j);
  arr.insertBefore(l[a], l[b]); //move l[a] to just before l[b]
  arr.insertBefore(l[b], l[a]); // move l[a] to before l[n] 
}

let timeouts = []

function setup() {
  frameRate(3); //Only update once every few seconds
  
  poem_div = select('#poem');
  
  //allows access to all the words of the poem
  //see https://www.w3schools.com/jsref/dom_obj_all.asp for a list of functions you can
  //call on poem_div.elt
  words = poem_div.elt;
  
  nwords = poem_div.elt.childNodes.length;
  print('Number of words in the poem: ', nwords);
  
  function start() {
      loop(); 
      timeouts.forEach(x => clearTimeout(x));
      append(timeouts, setTimeout(noLoop, 5000));
  }
    
  again = select('#again');
  again.mouseClicked(start);
  start();
    
}

function draw() {
  //words.childNodes containt 3 kinds of things, words, spaces and linebreaks
  //if i labels a word then words.childNodes[i].nodeName === 'SPAN'
  //if i labels a space then words.childNodes[i].nodeName === '#text'
  //if i labels a line break then words.childNodes[i].nodeName === 'BR'
  //so only swap words
  
  //keep choosing random integers until we get two words
  let i,j
  do {
    i = floor(random(nwords));
  }
  while(words.childNodes[i].nodeName !== 'SPAN')
  
  do {
    j = floor(random(nwords));
  }
  while(words.childNodes[j].nodeName !== 'SPAN')
  
  swap(words, i, j);
  fixCapitalisation(words, i);
  fixCapitalisation(words, j);
  
}