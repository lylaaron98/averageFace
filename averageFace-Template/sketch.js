var imgs = [];
var avgImg;
var img0;
var lerpImg;
var numOfImages = 30;
var randomNum = 0;
var loadCounter = 0;

//////////////////////////////////////////////////////////
function preload() // preload() runs once
{ 
	//to load images from assets in
	for(var i=0; i<numOfImages;i++)
	{
		var img = loadImage("assets/"+i+".jpg", imageLoadSuccess);
		imgs.push(img);
	}
	
}

//to check the images have been loaded
function imageLoadSuccess()
{
	loadCounter++;
	console.log(loadCounter);
}

//////////////////////////////////////////////////////////
function setup() 
{
	img0 = imgs[0];
    createCanvas(img0.width*2, img0.height);
    pixelDensity(1);
    
}
//////////////////////////////////////////////////////////
function draw() 
{	
    background(125);  
    if(loadCounter != numOfImages)
    {
    	console.log("not ready");
    	return;
    }
    console.log("All images loaded, ready for average face!");
    var img = averageFace(imgs);
	image(img0,0,0);
	image(img,img.width,0);
    noLoop();

}

function averageFace(images)
{
	console.log("In average face");
	//load the pixels of all images in the array
	for(var i=0;i<images.length;i++)
	{
		images[i].loadPixels();
	}
	
	//create a blank image to store all the ave RGB value
	var imgOut = createImage(images[0].width,
							 images[0].height);
	imgOut.loadPixels();
	
	//each row of array
	for(var y=0;y<imgOut.height;y++)
	{
		//each column
		for(var x=0;x<imgOut.width;x++)
		{
			var pixelIndex = ((imgOut.width * y) + x) * 4;
			imgOut.set(x,y,color(pixelIndex,0,0));
			
			//to compute the average RGB for each pixel for all the images
			var rSum = 0;
			var gSum = 0;
			var bSum = 0;
			
			//go to each image in images to get the RGB value for that pixel
			for(var i=0; i<images.length; i++)
			{
			 	var img = images[i];
			 	rSum+= img.pixels[pixelIndex+0];
			 	gSum += img.pixels[pixelIndex+1];
			 	bSum += img.pixels[pixelIndex+2];
			 }
			 
			 imgOut.pixels[pixelIndex+0] = rSum/images.length;
			 imgOut.pixels[pixelIndex+1] = gSum/images.length;
			 imgOut.pixels[pixelIndex+2] = bSum/images.length;
			 imgOut.pixels[pixelIndex+3] = 255;
		}
	}
	
	imgOut.updatePixels();
	
	//lerp images with mouse cursor
        
    if(mouseX <= canvas.width)
        {
            var mappedMX = map(mouseX, 0, images[0].width*2, 0, 1);
        }
        else
        {
            var mappedMX = map(canvas.width, 0, images[0].width*2, 0, 1)
        }

        for(var y =0; y < imgOut.height; y++)
        {
            for(var x = 0; x < imgOut.width; x++)
            {
                var pIndex = ((imgOut.width * y) + x ) * 4;
                var redSum = 0;
                var greenSum = 0;
                var blueSum = 0;

                for(var i=0; i<images.length; i++)
                {
                    var img = images[i];
                    redSum += imgOut.pixels[pIndex+0];
                    greenSum += imgOut.pixels[pIndex+1];
                    blueSum += imgOut.pixels[pIndex+2];
                }

                imgOut.pixels[pIndex+0] = lerp(images[0].pixels[pIndex+0], redSum/numOfImages, mappedMX);
                imgOut.pixels[pIndex+1] = lerp(images[0].pixels[pIndex+1], greenSum/numOfImages, mappedMX);
                imgOut.pixels[pIndex+2] = lerp(images[0].pixels[pIndex+2], blueSum/numOfImages, mappedMX);
                imgOut.pixels[pIndex+3] = 255; 

            }
        }
	
	imgOut.updatePixels();
	return imgOut;
}

//function to make right side red

function redFilter(imgs)
{	
    imgs.loadPixels();
    
    for(var x=0;x<imgs.width;x++)
        {
            for(var y=0;y<imgs.width;y++)
                {
                    var pixelIndex=((imgs.width*y)+x)*4;
                    var oldRed=imgs.pixels[pixelIndex+0];
              //setting oldRed to its orignal while other holds 0
              imgs.pixels[pixelIndex+0]=oldRed;
              imgs.pixels[pixelIndex+1]=0;
              imgs.pixels[pixelIndex+2]=0;
              imgs.pixels[pixelIndex+3]=255;        
                    
                }  
        }
    imgs.updatePixels();
    return imgs;
}

//function to change the left face on keypress

function keyPressed()
{
    if(keyCode === SHIFT)
    {
        randomNum = getRandomInt(numOfImages);
        image(imgs[randomNum],0,0); 
    }
}

function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

function mouseMoved()
{
    loop();
}

