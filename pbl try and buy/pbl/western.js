const userPhotoInput = document.getElementById('upload-photo');
const userPhoto = document.getElementById('user-photo');
const canvas = document.getElementById('output-image');
const ctx = canvas.getContext('2d');

let userImage = null;

// Step 1: Load User Photo
userPhotoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    userPhoto.src = reader.result;
    userImage = new Image();
    userImage.src = reader.result;

    userImage.onload = () => {
      // Resize the canvas to fit the image (keeping aspect ratio)
      const imgWidth = userImage.width * 0.6; // Scale width to 60% of original width
      const imgHeight = userImage.height * (imgWidth / userImage.width); // Adjust height to keep aspect ratio

      // Limit the height if it's too large
      if (imgHeight > 500) {
        const scale = 500 / imgHeight;
        canvas.width = imgWidth * scale;
        canvas.height = 500;
      } else {
        canvas.width = imgWidth;
        canvas.height = imgHeight;
      }

      // Draw the resized image on the canvas
      ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});


// Try on a dress
function tryOnDress(dressPath) {
    if (!userImage) {
        alert('Please upload your photo first!');
        return;
    }

    const dressImage = new Image();
    dressImage.src = dressPath; // Load the selected dress image
    dressImage.crossOrigin = 'anonymous'; // Handle CORS issues if necessary

    dressImage.onload = () => {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw the user photo
        ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);

        // Calculate dress dimensions
        const dressWidth = canvas.width * 0.5; // Scale the dress to fit the body
        const dressHeight = dressImage.height * (dressWidth / dressImage.width); // Maintain aspect ratio

        // Set a default position
        let xPosition = canvas.width * 0.25; // Horizontally center the dress
        let yPosition = canvas.height * 0.4; // Default position near shoulders

        // Adjust position dynamically based on the dress type
        if (dressPath === 'long_gown.png') {
            yPosition = canvas.height * 0.3; // Slightly higher for long gowns
        } else if (dressPath === 'short_top.png') {
            yPosition = canvas.height * 0.5; // Lower for short tops
        }

        // Draw the dress on the canvas
        ctx.drawImage(dressImage, xPosition, yPosition, dressWidth, dressHeight);
    };

    dressImage.onerror = () => {
        alert('Failed to load the dress image. Please check the file path.');
    };
}
const widthSlider = document.getElementById('width-slider');
const heightSlider = document.getElementById('height-slider');
const xOffsetSlider = document.getElementById('x-offset-slider');
const yOffsetSlider = document.getElementById('y-offset-slider');

let currentDressImage = null; // Store the current dress image for adjustments

function tryOnDress(dressPath) {
    if (!userImage) {
        alert('Please upload your photo first!');
        return;
    }

    const dressImage = new Image();
    dressImage.src = dressPath;
    dressImage.crossOrigin = 'anonymous'; // Handle CORS issues if necessary

    dressImage.onload = () => {
        currentDressImage = dressImage; // Store the dress image
        drawDress();
    };

    dressImage.onerror = () => {
        alert('Failed to load the dress image. Please check the file path.');
    };
}

function drawDress() {
    if (!userImage || !currentDressImage) return;

    // Clear the canvas and redraw the user photo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);

    // Get slider values
    const dressWidth = (canvas.width * widthSlider.value) / 100; // Scale dress width
    const dressHeight = (currentDressImage.height * dressWidth) / currentDressImage.width; // Maintain aspect ratio
    const xPosition = (canvas.width * xOffsetSlider.value) / 100; // Adjust horizontal position
    const yPosition = (canvas.height * yOffsetSlider.value) / 100; // Adjust vertical position

    // Draw the dress on the canvas
    ctx.drawImage(
        currentDressImage,
        canvas.width / 2 - dressWidth / 2 + xPosition, // Center the dress horizontally
        canvas.height * 0.4 + yPosition, // Adjust vertical position
        dressWidth,
        dressHeight
    );
}

// Add event listeners to sliders to redraw the dress dynamically
[widthSlider, heightSlider, xOffsetSlider, yOffsetSlider].forEach((slider) => {
    slider.addEventListener('input', drawDress);
});

// Download the result
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'try_and_buy_result.png';
    link.href = canvas.toDataURL();
    link.click();
});
