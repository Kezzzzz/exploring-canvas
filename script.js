window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const uploadBtn = document.querySelector("#upload-button");
  const fileInput = document.querySelector("#file-input");
  const nextBtn = document.querySelector("#next-button");
  const prevBtn = document.querySelector("#prev-button");
  const ctx = canvas.getContext("2d");
  const lineWidth = 1;
  const fontStyle = "10px Poppins";

  let drawing = false; // Is the user drawing?
  let squareStart = { x: 0, y: 0 }; // The starting point of the square
  let squareSize = { x: 0, y: 0 }; // The size of the square
  let images = []; // All the images that have been uploaded AND their data
  let activeImage = 0; // The image that is currently being drawn on

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
    if (images.length === 0) return; // If there are no images, don't draw

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
    if (images.length === 0) return alert("Upload an image first"); // If there are no images, don't draw

    drawing = false;
    // Calculate the size of the square
    let xSize = e.clientX - squareStart.x - 50; // -50 to account for the padding
    let ySize = e.clientY - squareStart.y - 50; // -50 to account for the padding

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
    images[activeImage].annotations.push(annotation);
    updateListOfAnnotations();
  }

  function deleteAnnotation(id) {
    // Erase all annotations
    removeStrokes();

    // Remove annotation from the array
    images[activeImage].annotations = images[activeImage].annotations.filter(
      (ann) => ann.id != id
    );
    updateListOfAnnotations();

    // Redraw the remaining annotations to fix any cropping overlaps
    redrawAnnotations();
  }

  function updateListOfAnnotations() {
    // Show the list of annotations
    const list = document.querySelector("#annotation-list");
    list.innerHTML = "";

    if (images[activeImage].annotations.length === 0) {
      list.innerHTML = "No annotations";
    } else {
      images[activeImage].annotations.forEach((annotation) => {
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
    // Redraw the active image
    const image = new Image();
    image.src = images[activeImage].image;
    image.onload = (props) => {
      ctx.drawImage(
        image,
        canvas.width / 2 - props.path[0].width / 2,
        canvas.height / 2 - props.path[0].height / 2,
        props.path[0].width,
        props.path[0].height
      );
    };

    // Redraw all the annotations
    setTimeout(() => {
      images[activeImage].annotations.forEach((annotation) => {
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
    }, 100);
  }

  // Upload file to the canvas
  function uploadFileToCanvas() {
    // Get the file
    const file = fileInput.files[0];

    // Create a new FileReader object
    const reader = new FileReader();

    // When the file is loaded, draw it to the canvas and save the image data
    reader.addEventListener("load", () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = (props) => {
        // Draw the image to the center of the canvas (just looks nice)
        ctx.drawImage(
          image,
          canvas.width / 2 - props.path[0].width / 2,
          canvas.height / 2 - props.path[0].height / 2,
          props.path[0].width,
          props.path[0].height
        );
      };

      // Save the image data in the "state"
      let newImageObj = {
        id: Date.now(),
        image: reader.result,
        annotations: [],
      };
      images = [...images, newImageObj];

      checkNextPrevButtonState();
    });

    // Read the file
    reader.readAsDataURL(file);
  }

  // disable next and previous buttons if there are no images
  function checkNextPrevButtonState() {
    if (images.length === 0) {
      nextBtn.disabled = true;
      prevBtn.disabled = true;
    } else if (activeImage === 0) {
      nextBtn.disabled = false;
      prevBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
      prevBtn.disabled = false;
    }
  }

  // Event listeners
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", calculateSquareSize);
  uploadBtn.addEventListener("click", uploadFileToCanvas);

  // this event listener would be what we can use to display a preview of the rectangle before setting it
  //  canvas.addEventListener("mousemove", drawSquare);

  initializeCanvas();
  checkNextPrevButtonState();
});
