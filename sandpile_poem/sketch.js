let defaultColor = [255, 0, 0];

/*
let colors = ['#003f5c',
'#7a5195',
'#ef5675',
'#ffa600'];
*/

let colors = [
  '#581845',
  '#900C3F',
'#C70039',
'#FF5733',
  '#FFC300',
];


let sandpiles, nextpiles;


let poem = [
 '', 
 'There’s chaos in the shimmering heat,',
 'All jives and jostles, structures melt and',
 'Order boils until absence is complete,',
 'Of pattern in the scorching shifting sand.',
 '',
 'While bitter, on the other side, jutting',
 'Great crystal castles. Lattice works of ice.',
 'Their shear edges almost touching, cutting',
 'Cleaving space apart, to each a separate slice.',
 '',
 'It’s in between that pattern start to dance,',
 'merging melting bodies, all together. ',
 'Hypnotic orchestras dictate their trance. ',
 'Connected through some esoteric aether.',
 '',
 'These littles worlds found only at the borders',
 ' create their own unique and gentle orders '];

let a = 0;
let ch = 7; //cell height
let cw = 7; //cell width

let cells;
let gridW, gridH;

let mouseclicks = [];

//this just draws grid lines
function drawGrid() {
  stroke(0);
  for(let x = 0; x <= width; x += cw) {
    line(x, 0, x, height);
  }
  for(let y = 0; y <= height; y += ch) {
    line(0, y, width, y);
  }
}

function setup() {
  //createCanvas(800, 400);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(5);
  textAlign(CENTER);
  stroke(0);
  
  gridW = ceil(width / cw);
  gridH = ceil(height / ch);
  
  sandpiles = new Array(gridW).fill().map(i => new Array(gridH).fill(0));
  nextpiles = new Array(gridW).fill().map(i => new Array(gridH).fill(0));
  touched = new Array(gridW).fill().map(i => new Array(gridH).fill(0));

  sandpiles[floor(gridW / 2)][floor(gridH / 2)] = 1000000000;

}


//give this a function of (i,j,x,y) and it'll execute it for all the cells
function mapOverCells(f) {
    let x = 0.5 * cw;
    for(let i = 0; i < gridW; i++) {
      let y = 0.5 * ch;
      for(let j = 0; j < gridH; j++) {
        f(i,j, x, y);
        y += ch; 
    }
  x += cw; 
  }
}

function drawPoem() {
  stroke(0);
  mapOverCells(function(i, j, x, y) {    
    //draw the poem in a second loop so we can put it on top
    let k = floor(j / 2);
    if(j%2 && k < poem.length && i < poem[k].length) {
        stroke(0, 0, 255);
        fill(0, 0, 255);
        text(poem[k][i],x + floor(width/cw/3)*cw,y+10*ch)
      }
  });
}

//make a little timing loop that clicks a random cell for a random amount of time
let timer = 0
let ti, tj;

function draw() {
  background(270, 90, 90, 100);
  //drawGrid(); //draw a grid
  
  //add to the cell where we're holding the mouse buttong
  mouseclicks.map((c) => sandpiles[floor(c[0] / cw)][floor(c[1] / ch)] += 1);
  

  noStroke();
  mapOverCells(function(i, j, x, y) {
    //need to do the copy now before going through the loop again to modify
    nextpiles[i][j] = sandpiles[i][j];
    
    //draw the circles
    let f = sandpiles[i][j];
    if(f > 0) {
        let c = colors[(f-1) % 4];
        fill(c);  
        ellipse(x,y,cw/1.5,ch/1.5);
        //rect(x,y,cw,ch);
    }
  })
  

    drawPoem();

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

function drawGradient(x, y, radius, h) {
  for (let r = radius; r > 0; --r) {
    let hh = (h + min(radius - r, 150)) % 360;
    fill(hh, 90, 90, 1);
    ellipse(x, y, r, r);
  }
}

function mouseClicked() {
 append(mouseclicks, [mouseX, mouseY]);
}