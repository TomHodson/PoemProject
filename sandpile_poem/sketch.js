const FADE_TIME = 8000; //in milliseconds
const START_DELAY = 1500;
const SAND_FRAMERATE = 5;

const CH = 7; //cell height in pixels
const CW = 7; //cell width

const COLORS = [
  '#58184500',  
  '#900C3F',
'#C70039',
'#FF5733',
  '#FFC300',
];

let background_color = "#59115c";



let cells;
let gridW, gridH;
let sandpiles, nextpiles;
let mouseclicks = [];
let timeouts = [];

function addRight() {append(mouseclicks, [windowWidth*random(0.8,0.95), windowHeight*random(0.2,0.8)]); print(mouseclicks);}
function addBottom() {append(mouseclicks, [windowWidth*random(0.2,0.8), windowHeight*random(0.8,0.95)]); print(mouseclicks);}

function setupSandpiles() {
  gridW = ceil(width / CW);
  gridH = ceil(height / CH);
    
  sandpiles = new Array(gridW).fill().map(i => new Array(gridH).fill(0));
  nextpiles = new Array(gridW).fill().map(i => new Array(gridH).fill(0));
  touched = new Array(gridW).fill().map(i => new Array(gridH).fill(0));
    
  mouseclicks = [];
  timeouts.forEach(x => clearTimeout(x));
  timeouts = [];
    
  append(timeouts, setTimeout(addRight, 1000));
  append(timeouts, setTimeout(addRight, 4000));
  append(timeouts, setTimeout(addBottom, 10000));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupSandpiles();
  background(background_color);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupSandpiles();
  
  background_color = color(background_color);
  background_color.setAlpha(0);
  background(background_color);
    
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(5);
  stroke(0);
}


//give this a function of (i,j,x,y) and it'll execute it for all the cells
function mapOverCells(f) {
    let x = 0.5 * CW;
    for(let i = 0; i < gridW; i++) {
      let y = 0.5 * CH;
      for(let j = 0; j < gridH; j++) {
        f(i,j, x, y);
        y += CH; 
    }
  x += CW; 
  }
}

function draw() {
  if(millis() < FADE_TIME) {background_color.setAlpha(255 * min(millis() / FADE_TIME, 1));}
  background(background_color); 
    
  //delay starting the sandpiles for a bit and keep the framerate high to get a smooth animation at the begining
  if(millis() < START_DELAY) {frameRate(30);}
  else {
  frameRate(SAND_FRAMERATE);
  
  //add to the cell where we're holding the mouse buttong
  mouseclicks.map(c => sandpiles[floor(c[0] / CW)][floor(c[1] / CH)] += 1);
  
  noStroke();
  mapOverCells(function(i, j, x, y) {
    //need to do the copy now before going through the loop again to modify
    nextpiles[i][j] = sandpiles[i][j];
    
    //draw the circles
    let f = sandpiles[i][j];
    if(f > 0) {
        let c = COLORS[(f-1) % 4];
        fill(c);  
        ellipse(x,y, CW/1.5,CH/1.5);
        //rect(x,y,CW,CH);
    }
  })

mapOverCells(function(i, j, x, y) {
      let num = sandpiles[i][j];
      if (num >= 5) {
        nextpiles[i][j] -= 4;
        if (i + 1 < gridW)
          nextpiles[i + 1][j]++;
        if (i - 1 >= 0)
          nextpiles[i - 1][j]++;
        if (j + 1 < gridH)
          nextpiles[i][j + 1]++;
        if (j - 1 >= 0)
          nextpiles[i][j - 1]++;
      }
    });

  let tmp = sandpiles;
  sandpiles = nextpiles;
  nextpiles = tmp;
}
}

function mouseClicked() {
 append(mouseclicks, [mouseX, mouseY]);
}