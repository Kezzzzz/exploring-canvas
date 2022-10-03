# Exploring canvas

This project is an exploration into canvas and its capabilities.

Starting by being able to upload an image and annotate it with rectangles which can be drawn by the user.

Those annotations will then be tied to that image, and you can upload more images and create new annotations. And so on, and so on.

## How to run this project

This is a completely vanilla HTML/CSS/JS project. Just open up `index.html` in your browser!

Or run it with [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) which can be installed in VSCode.

## Steps taken

This is going to be very informal explanation of my thought process on how I tackled this problem so far.

### 1. Learn the basic setup of canvas

I needed to figure out how to initialise and draw a canvas, how it should typically be styled, and how to access the "2d context" of the canvas.

### 2. Learn how to draw rectangles

Once I figured that out, I just wanted to be able to draw a rectangle, no user input. I found this out using `fillRect()`. And then how to create just an outline using `strokeRect()`.

### 3. Learn how to draw rectangles with user input

I wanted to be able to draw a rectangle by clicking and dragging. I found out that I could use `mousedown`, `mousemove` and `mouseup` events to achieve this. I also needed to figure out how to get the coordinates of the mouse on the canvas.

I created 2 object which would store the current squareStart coordinates, and the squareSize. I then used the `mousedown` event to set the squareStart coordinates, and the `mousemove` event to set the squareSize. And then I used the `mouseup` event to draw the rectangle.

I then realised I did not need the `mousemove` event, and I could just use the `mouseup` event to draw the rectangle, using the start position offset from the mouse position.

### 4. Add text to the rectangles

I wanted to be able to add text to the rectangles. I found out that I could use `fillText()` to do this. I also needed to figure out how to get the text input from the user. I found out that I could use `prompt()` to do this.

### 5. Store the rectangles

I wanted to be able to store the rectangles somewhere, first step is to just store them in the local state of the page (not localStorage yet). I created an empty array and then would push the data of each rectangle into it.

TODO: Add the state to local storage and use getter setters.

### 6. Be able to delete a rectangle

I wanted to be able to delete a rectangle. I found out that I could use `clearRect()` to do this for deleting the canvas space. I also needed to remove the corresponding rectangle from the array of objects. I used the `filter` function for this.

An issue I hit was overlapping rectangles would end up being cleared too when clearing one that was on top. It would make the rectangle "behind" it disappear only at the overlapped section. To negate this, I redraw all the rectangles after deleting one, this way the rectangles are never partially removed accidentally.

### 7. Be able to upload an image from the user

I added the functionality to upload an image from the user and store it into the state and have the canvas display it. No complications here, it required to use the Image API and the FileReader API.

### 8. Be able to draw rectangles on top of the image

To do this, we need to track the annotations along with the image in the state. I created a new array of object which would store the annotations with the image and changed all the logic to listen for the `activeImage.annotations` insteads of just the `allSquares` array I was using through testing.

Once this was added, again I was getting issues where clearing the rectangles would clear the background image too if they overlapped. So I needed to add logic to redraw the image when deleting rectangles, and also make sure it draws the image first and then the rectangles. So the rectangles would reappear above the image. There was a slight race condition with this, so putting the rectangle drawing in a very small setTimeout did the trick. Maybe refactoring into a promise is better?

### 9. Be able to add another image to the canvas on a blank sheet

WIP

### 10. Be able to cycle through the images and their annotations like a carousel

WIP

## Enhancements!!

- [ ] Add a way to delete an image
- [ ] Add a way to delete all annotations
- [ ] Make the whole thing responsive and mobile friendly
- [ ] Be able to have custom colours for the rectangles
- [ ] Be able to upload more than one image at a time

#### Time spent - 6 hours as of 7:30pm 2/10/2022
