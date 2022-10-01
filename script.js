window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const lineWidth = 1;
  const fontStyle = "10px Poppins";
  let drawing = false; // Is the user drawing?
  let squareStart = { x: 0, y: 0 }; // The starting point of the square
  let squareSize = { x: 0, y: 0 }; // The size of the square
  let allSquares = []; // All the squares that have been drawn

  initializeCanvas();

  // Initialize the canvas
  function initializeCanvas() {
    // Set the canvas to the size of the window
    canvas.width = 500;
    canvas.height = 500;

    // Set the line width and font style
    ctx.lineWidth = lineWidth;
    ctx.font = fontStyle;

    // Redraw all the squares when the window is resized
    // Issue: When you resize the window, the squares are not scaled - for now we force a fixed width/height :(
    window.addEventListener("resize", () => {
      canvas.width = 500;
      canvas.height = 500;
      removeStrokes();
      redrawAnnotations();
    });
  }

  function startPosition(e) {
    // When the user starts drawing
    drawing = true;
    squareStart.x = e.clientX - canvas.offsetLeft;
    squareStart.y = e.clientY - canvas.offsetTop;
  }

  function resetSquareSize() {
    // Reset the size of the square
    squareSize = { x: 0, y: 0 };
    squareStart = { x: 0, y: 0 };
  }

  function calculateSquareSize(e) {
    drawing = false;
    // Calculate the size of the square
    let xSize = e.clientX - squareStart.x;
    let ySize = e.clientY - squareStart.y;

    // if the user just clicks and doesnt drag a square, do nothing.
    if (xSize === 0 || ySize === 0) {
      return;
    } else {
      // if the user drags, calculate set the size of the square
      squareSize.x = xSize;
      squareSize.y = ySize;

      draw(e);
    }
  }

  function draw(e) {
    // Draw the square
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(squareStart.x, squareStart.y, squareSize.x, squareSize.y);
    ctx.stroke();
    createAnnotation(squareStart.x, squareStart.y, squareSize.x, squareSize.y);
    resetSquareSize();
  }

  function removeStrokes() {
    // Remove all the strokes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function createAnnotation(stX, stY, sizeX, sizeY) {
    // Create the text prompt
    // TODO: Make this a custom prompt modal instead
    let text = prompt("Enter text for the annotation");
    ctx.font = fontStyle;
    ctx.fillText(text, squareStart.x + 5, squareStart.y + 12);

    // Create the annotation object
    const annotation = {
      id: Date.now(), // A unique id for the annotation
      x: squareStart.x, // The x coordinate of the annotation
      y: squareStart.y, // The y coordinate of the annotation
      width: squareSize.x, // The width of the annotation
      height: squareSize.y, // The height of the annotation
      text: text, // The text of the annotation
    };

    // Add the annotation to the array
    allSquares.push(annotation);
    updateListOfAnnotations();
  }

  function deleteAnnotation(id) {
    // Erase all annotations
    removeStrokes();

    // Remove annotation from the array
    allSquares = allSquares.filter((ann) => ann.id != id);
    updateListOfAnnotations();

    // Redraw the remaining annotations to fix any cropping overlaps
    redrawAnnotations();
  }

  function updateListOfAnnotations() {
    // Show the list of annotations
    const list = document.querySelector("#annotation-list");
    list.innerHTML = "";

    if (allSquares.length === 0) {
      list.innerHTML = "No annotations";
    } else {
      allSquares.forEach((annotation) => {
        const listItem = document.createElement("li");
        listItem.innerHTML =
          annotation.text +
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          `<button id='deleteBtn' class='deleteBtn' data-annotation-id=${annotation.id} >Delete</button>`;
        list.appendChild(listItem);
      });

      // Add event listeners to the delete buttons
      const deleteButtons = document.querySelectorAll(".deleteBtn");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          deleteAnnotation(e.target.dataset.annotationId);
        });
      });
    }
  }

  function redrawAnnotations() {
    // Redraw all the annotations
    allSquares.forEach((annotation) => {
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height
      );
      ctx.stroke();
      ctx.font = fontStyle;
      ctx.fillText(annotation.text, annotation.x + 5, annotation.y + 12);
    });
  }

  // Event listeners
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", calculateSquareSize);

  // this event listener would be what we can use to display a preview of the rectangle before setting it
  //  canvas.addEventListener("mousemove", drawSquare);
});
