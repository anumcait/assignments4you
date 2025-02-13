//js configuration for flat picker
flatpickr("#deadline", {
  enableTime: true, // If you want to enable time selection
  altFormat: "F j, Y",
  minDate: "today", // Disable past dates
  dateFormat: "Y-m-d H:i", // Date format
});

//js code for telling user how many days left untiil deadline after selecting date
document.getElementById("deadline").addEventListener("input", function () {
  var selectedDate = new Date(this.value);
  var currentDate = new Date();
  var daysLeft = Math.floor((selectedDate - currentDate) / (1000 * 60 * 60 * 24));

  if (daysLeft >= 0) {
    document.getElementById("daysLeft").textContent = "Days left until deadline: " + daysLeft;
  } else {
    document.getElementById("daysLeft").textContent = "Invalid deadline";
  }
});

//js code for automattically filling the form fied pages once student enters words
document.getElementById("wordCount").addEventListener("input", function () {
  var wordCount = parseInt(this.value);
  var wordsPerPage = 250; // You can adjust this based on your preference
  var pages = Math.ceil(wordCount / wordsPerPage);

  if (!isNaN(pages) && pages >= 1) {
    document.getElementById("pages").value = pages;
  } else {
    document.getElementById("pages").value = 1; // Default to 1 page if invalid input
  }
});

//js code for handling the files and displaying them, and submitting the form
const fileList = document.getElementById("file-list");
const spinner = document.getElementById("spinner");
const alertSuccess = document.querySelector(".alert-success");
const alertDanger = document.querySelector(".alert-danger");
const spinnerImg = ` <img src="/assets/img/spinner.gif" alt="" width="100px">`;

let uploadedFiles = [];
function handleFileUpload(input) {
  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i];
    // Check if the file is already uploaded
    if (!uploadedFiles.find((uploadedFile) => uploadedFile.name === file.name)) {
      uploadedFiles.push(file);
    }
  }
  filesDisplay();
}

function filesDisplay() {
  while (fileList.hasChildNodes()) {
    fileList.removeChild(fileList.firstChild);
  }
  for (let i = 0; i < uploadedFiles.length; i++) {
    const fileInfo = document.createElement("div");
    const removeBtn = document.createElement("span");
    fileInfo.classList.add("file-info");
    fileInfo.textContent = uploadedFiles[i].name;
    removeBtn.classList.add("remove-btn");
    removeBtn.innerHTML = '<i class="bi bi-trash3"></i>';
    removeBtn.onclick = function () {
      uploadedFiles.splice(i, 1); // Remove file from array
      fileInfo.remove(); // Remove file info when remove button is clicked
    };
    fileInfo.appendChild(removeBtn);
    fileList.appendChild(fileInfo);
  }
}

//submitting the form
document.getElementById("order-form").addEventListener("submit", function (event) {
  event.preventDefault();
  spinner.innerHTML = spinnerImg;
  const formData = new FormData(this); // Get form data

  // Remove existing files from formData
  formData.delete("files");

  // Append individually added files to formData
  uploadedFiles.forEach((file) => {
    formData.append("files", file);
  });

  fetch("/dashboard/orderassignment/submit", {
    method: "POST",
    body: formData,
  })
    .then((response) => {

         if (response.ok) {
        spinner.removeChild(spinner.firstElementChild);
        alertSuccess.innerText = "Order submitted successfully!";
        alertSuccess.classList.add("alert");
        // Optionally reset the form and clear selected files array
        this.reset();
        uploadedFiles = [];
        filesDisplay(); // Clear file display

         // Hide the success message after 3 seconds
         setTimeout(() => {
          alertSuccess.classList.remove("alert");
          window.location.href = "/dashboard";
          alertSuccess.innerText = ''; // Optional: Clears the text
      }, 3000); // 3000 ms = 3 seconds


       // window.location.href = "/dashboard";
      } else {
        alertDanger.innerText = "Failed to submit order.";
        alertDanger.classList.add("alert");
        this.reset();
        uploadedFiles = [];
        filesDisplay(); // Clear file display
      }
    })
    // .catch((error) => {
    //   console.error("Error:", error);
    // });
    .catch((error) => {
      // Remove the spinner in case of error
      spinner.innerHTML = "";

      console.error("Error:", error);
      // Show error alert on network or server-side failure
      alertDanger.innerText = "An error occurred while submitting your order.";
      alertDanger.classList.add("alert", "alert-danger");
      alertDanger.style.display = "block"; // Make the error alert visible

      // Optionally reset the form and clear uploaded files
      this.reset();
      uploadedFiles = [];
      filesDisplay();
  });
});
var dtT;
