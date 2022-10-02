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

I wanted to be able to store the rectangles, so that I could draw them again when the page is refreshed. I found out that I could use `localStorage` to do this. I also needed to figure out how to store the rectangles in a way that I could draw them again. I found out that I could use an array of objects to do this.

### 6. Be able to delete a rectangle

I wanted to be able to delete a rectangle. I found out that I could use `clearRect()` to do this for deleting the canvas space. I also needed to remove the corresponding rectangle from the array of objects. I used the `filter` function for this.

An issue I hit was overlapping rectangles would end up being cleared too when clearing one that was on top. It would make the rectangle "behind" it disappear only at the overlapped section. To negate this, I redraw all the rectangles after deleting one, this way the rectangles are never partially removed accidentally.

### 7. Be able to upload an image from the user

TBD

### 8. Be able to draw rectangles on top of the image

TBD

### 9. Modify the state to handle images and their annotations

TBD

### 10. Be able to cycle through the images and their annotations like a carousel

TBD

## Enhancements!!

soon:tm:
