var jqueryScript = document.createElement('script');
var bootstrapScript = document.createElement('script');

// Set attributes for the jQuery script
jqueryScript.src = 'https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js';
jqueryScript.integrity = 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj';
jqueryScript.crossorigin = 'anonymous';

// Set attributes for the Bootstrap script
bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js';
bootstrapScript.integrity = 'sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct';
bootstrapScript.crossorigin = 'anonymous';

// Get the head element and append the scripts
var head = document.head || document.getElementsByTagName('head')[0];
head.appendChild(jqueryScript);
head.appendChild(bootstrapScript);

function clearSelectedServicesFromLocalStorage() {
    localStorage.removeItem('selectedServices');
}
clearSelectedServicesFromLocalStorage() 
 
 
 
  var myEditorProblem;
  var myEditorSolution;
        
  // Create a script element for CKEditor
var ckEditorScript = document.createElement('script');
ckEditorScript.src = 'https://cdn.ckeditor.com/ckeditor5/37.0.0/classic/ckeditor.js';
ckEditorScript.async = true; // Load script asynchronously

// Callback function to create the editors after the CKEditor script is loaded
function createEditors() {
    ClassicEditor
        .create(document.querySelector('#problem'))
        .then(editor => {
            myEditorProblem = editor;
        })
        .catch(error => {
            console.error('Error initializing the problem editor', error);
        });

    ClassicEditor
        .create(document.querySelector('#solution'))
        .then(editor => {
            myEditorSolution = editor;
        })
        .catch(error => {
            console.error('Error initializing the solution editor', error);
        });
}

// Modern browsers support defer, which ensures the script executes after the HTML is parsed
if (ckEditorScript.defer !== undefined) {
    ckEditorScript.onload = createEditors; // Load editors after CKEditor script is loaded
} else {
    // For older browsers that don't support defer, create the editors after a small delay
    var editorLoadTimer = setInterval(function() {
        if (window.ClassicEditor) {
            clearInterval(editorLoadTimer);
            createEditors(); // Load editors after CKEditor script is loaded
        }
    }, 100);
}

document.head.appendChild(ckEditorScript);      
 
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var editToken = urlParams.get('token');

if(editToken){
  // Fetch email suggestions from the API
  document.querySelector('#contactInfoSection').style.display = 'block'
  fetch(`https://owlapplicationbuilder.com/api/entities/simpler_digital_marketing_1580295343903_96/quotes/get_all_en?page=1&page_size=115&fld=_id&srt=-1&to_search={"token":"${editToken}"}&t=true`)
    .then(response => response.json())
    .then(data => {
      console.log("data", data);
      var projectTitle = document.getElementById('projectTitle').value = data.data[0].projectTitle ;
      var projectDescription = document.getElementById('projectDescription').value = data.data[0].projectdescription;
      var sourcePlatform = document.getElementById('sourcePlatform').value = data.data[0].sourcePlatform;
      var clientName = document.getElementById('clientName').value = data.data[0].clientName;
      var emailAddress = document.getElementById('emailAddress').value = data.data[0].clientEmail;
      var phoneNumber = document.getElementById('phoneNumber').value = data.data[0].clientPhoneNumber;
      var salesPerson = data.data[0].salesPerson_key;
      salesPersonEdit(salesPerson);
      myEditorProblem.setData(data.data[0].problem);
      myEditorSolution.setData(data.data[0].solution);
      var listItems = data.data[0].listItems;
      var selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
      listItems.map((item)=>{
          var service = {
          price: item.price,
          type: item.type,
          title: item.title,
          desc: item.desc,
          token: item.token
        };
      selectedServices.push(service);
      
      var price = item.price;
      var type = item.type;
      var title = item.title;
      var descforUpdate = item.desc;
      var token = item.token;
      var ty = ''
      if(type == 'true'){
        ty = 'Recurring Payment'
      }else{
        ty = 'One Time Payment';
      }
      var table = document.querySelector('.table tbody');
      var newRow = document.createElement('tr');
      var titleCell = document.createElement('td');
      var desceCellForUpdate = document.createElement('td');
      var typeCell = document.createElement('td');
      var priceCell = document.createElement('td');
      var deleteButtonCell = document.createElement('td');
      var deleteButton = document.createElement('button');
      
      // Set the content for the table data cells
      titleCell.textContent = title;
      desceCellForUpdate.textContent = descforUpdate;
      typeCell.textContent = ty;
      priceCell.textContent = '$' + price;
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete');
      deleteButton.setAttribute('data-token', token);
      
      // Append the delete button to its cell
      deleteButtonCell.appendChild(deleteButton);
      
      // Append table data cells to the table row
      newRow.appendChild(titleCell);
       newRow.appendChild(desceCellForUpdate);
      newRow.appendChild(typeCell);
      newRow.appendChild(priceCell);
      newRow.appendChild(deleteButtonCell);
      
      // Append the new row to the table body
      table.appendChild(newRow);
      
      
      
      })
      
      // Store the updated 'selectedServices' array in local storage
      localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
      var totalPrice = getTotalPriceFromLocalStorageAsString();
      console.log('Total Price from selected services:', totalPrice);
      document.querySelector('.subTotalP b').innerHTML = `$ ${totalPrice}`;
      document.querySelector('.TotalP b').innerHTML = `$ ${totalPrice}`;
      deletedSelectedServices()
      var submitBtn = document.querySelector('.submitQuotation').classList.add('d-none');      
      var updateBtn = document.querySelector('.updateQuotation').classList.remove('d-none');
      
      
      
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}else{
  // fetchUserNames();
}
        
// Email Validator Check
 var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
function submitQuotation(){
  var submitQuotationBtn = document.querySelector('.submitQuotation')
  var loader = document.querySelector('.loader');
  var projectTitle = document.getElementById('projectTitle').value;
  var projectDescription = document.getElementById('projectDescription').value;
  var sourcePlatform = document.getElementById('sourcePlatform').value;
  var clientName = document.getElementById('clientName').value;
  var emailAddress = document.getElementById('emailAddress').value;
  var phoneNumber = document.getElementById('phoneNumber').value;
  // var selectUser = document.getElementById('selectUser').value;
  var selectedName = document.getElementById('selectUser');
  var selectUser = selectedName.options[selectedName.selectedIndex].innerText; 
  var selectUser_key = selectedName.options[selectedName.selectedIndex].value;  
var selectElement = document.getElementById("sourcePlatform");
var selectedOption = selectElement.options[selectElement.selectedIndex];
var selectedOptionText = selectedOption.innerText;

  console.log("selectSourcePlatform", selectedOptionText);

  var problem = myEditorProblem.getData();
  var solution = myEditorSolution.getData();
  var listItems = JSON.parse(localStorage.getItem('selectedServices')) || [];
  
  var url = 'https://n8n.owlapplicationbuilder.com/webhook-test/proposal-process';
 if (!projectTitle ||
    !projectDescription ||
    !sourcePlatform ||
    !clientName ||
    !emailAddress ||
    !emailRegex.test(emailAddress) ||
    !selectUser ||
    !problem ||
    !solution ||
    !listItems) {
  if (!emailRegex.test(emailAddress)) {
    alert('Please enter a valid email address.');
  } else {
    alert('Please fill all the required fields.');
  }
} else {
    loader.classList.remove('d-none');
    submitQuotationBtn.disabled = true;
  var data = {
      projectTitle,
      projectDescription,
      sourcePlatform,
      clientName,
      clientEmailAddress: emailAddress,
      clientPhoneNumber: phoneNumber,
      salesPerson: selectUser,
      salesPerson_key: selectUser_key,
      problem,
      solution,
      listItems: listItems,
      SourcePlatform:selectedOptionText,
      
  };
  
  const requestOptions = {
      method: 'POST',
      body: JSON.stringify(data)
  };
  
  fetch(url, requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('Response:', data);
          // location.reload();
          var createdToken = data.data[0].token;
          var proposalBtn = document.querySelector('#downloadproposal');
          var loader = document.querySelector('.loader');
          loader.classList.add('d-none');
          // proposalBtn.classList.remove('d-none');
          window.location.href = `https://admin.simplerdigitalmarketing.com/admin/quotes/view_en?token=${createdToken}`;
      })
      .catch(error => {
          console.error('There was an error:', error);
          submitQuotationBtn.disabled = false;
          loader.classList.add('d-none');
          // Handle errors here
      });

  }
}


function UpdateQuotation(){
      var updateQuotationBtn = document.querySelectorAll('.updateQuotation')
      var loader = document.querySelector('.loaders');
      var projectTitle = document.getElementById('projectTitle').value;
      var projectDescription = document.getElementById('projectDescription').value;
      var sourcePlatform = document.getElementById('sourcePlatform').value;
      var clientName = document.getElementById('clientName').value;
      var emailAddress = document.getElementById('emailAddress').value;
      var phoneNumber = document.getElementById('phoneNumber').value;
      // var selectUser = document.getElementById('selectUser').value;
  var selectedName = document.getElementById('selectUser');
  var selectUser = selectedName.options[selectedName.selectedIndex].innerText; 
    var selectUser_key = selectedName.options[selectedName.selectedIndex].value; 

    
      var problem = myEditorProblem.getData();
      var solution = myEditorSolution.getData();
      var listItems = JSON.parse(localStorage.getItem('selectedServices')) || [];
      var url = 'https://n8n.owlapplicationbuilder.com/webhook/update-proposal-process';
      if (!projectTitle ||
    !projectDescription ||
    !sourcePlatform ||
    !clientName ||
    !emailAddress ||
    !emailRegex.test(emailAddress) ||
    !selectUser ||
    !problem ||
    !solution ||
    !listItems) {
  if (!emailRegex.test(emailAddress)) {
    alert('Please enter a valid email address.');
  } else {
    alert('Please fill all the required fields.');
  }
} else {
        loader.classList.remove('d-none');
        updateQuotationBtn.disabled = true;
      var data = {
          form_data: {
            projectTitle,
            projectDescription,
            sourcePlatform,
            clientName,
            clientEmailAddress: emailAddress,
            clientPhoneNumber: phoneNumber,
            salesPerson: selectUser,
            salesPerson_key: selectUser_key,
            problem,
            solution,
            listItems: listItems 
          },
          selected_en: [`${editToken}`],
          action: "custom"
      };
      
      const requestOptions = {
          method: 'POST',
          body: JSON.stringify(data)
      };
      
      fetch(url, requestOptions)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              console.log('Response:', data);
              // location.reload();
              // var createdToken = data.data[0].token;
              // var proposalBtn = document.querySelector('#downloadproposal');
              var loader = document.querySelector('.loaders');
              loader.classList.add('d-none');
              var redirectUrl = `https://admin.simplerdigitalmarketing.com/admin/quotes/view_en?token=${editToken}`;

  // Set the new URL and reload the page
               window.location.href = redirectUrl;
              // proposalBtn.classList.remove('d-none');
              // window.location.href = `https://admin.simplerdigitalmarketing.com/admin/quotation/view_en?token=${createdToken}`;
          })
          .catch(error => {
              console.error('There was an error:', error);
              updateQuotationBtn.disabled = false;
              loader.classList.add('d-none');
              // Handle errors here
          });
    
      }
}


var expandContactInfoSec = document.querySelector('#sourcePlatform');
expandContactInfoSec.addEventListener('change', ()=>{
    var sourcePlatform = document.getElementById("sourcePlatform").value;
    var contactInfoSection = document.getElementById("contactInfoSection");

    if (sourcePlatform === "upwork" || sourcePlatform === "fiverr" || sourcePlatform === "website") {
      contactInfoSection.style.display = "block";
    } else {
      contactInfoSection.style.display = "none";
    }
  
}) 
  
  // End
  
// Start Function to fetch email suggestions based on the entered email
var getemaildata;
function fetchEmailSuggestions() {
  var emailAddress = document.getElementById("emailAddress").value;

  var emailSuggestions = document.getElementById("emailSuggestions");

  // Fetch email suggestions from the API
  fetch(`https://owlapplicationbuilder.com/api/entities/simpler_digital_marketing_1580295343903_96/users/get_all_en?page=1&page_size=115&fld=_id&srt=-1&to_search={"email": "${emailAddress}"}&t=true`)
    .then(response => response.json())
    .then(data => {
      console.log("data", data);
       getemaildata = data.data;
      if (emailAddress.trim() !== '' && getemaildata.length > 0) {
        // Display email suggestions
        var suggestionsHtml = '<div class="dropdown-menu-email">';
        getemaildata.forEach(user => {
          suggestionsHtml += '<a class="dropdown-item" href="#" onclick="fillUserData(\'' + user.first_name + '\', \'' + user.last_name + '\', \'' + user.phoneNumber + '\', \'' + user.email + '\'); hideEmailSuggestions()">' + user.email + '</a>';
        });
        suggestionsHtml += '</div>';
        emailSuggestions.innerHTML = suggestionsHtml;
        emailSuggestions.style.display = 'block'; // Show suggestions
      } else {
        // No email suggestions found or user hasn't typed anything
        emailSuggestions.innerHTML = `<secton id="emailSuggestionLayout"><div>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M26.8585 27.7492C24.9945 25.8851 22.4663 24.8379 19.8301 24.8379C17.1939 24.8379 15.0064 25.5443 13.1424 27.4084" stroke="#000624"/>
          <circle cx="14.3446" cy="21.7409" r="1.74087" fill="#000624"/>
          <circle cx="25.6553" cy="21.7409" r="1.74087" fill="#000624"/>
          <path d="M34.0994 8.5565L34.0996 8.55668C34.3513 8.80838 34.4937 9.14803 34.4998 9.5H25.5V0.500193C25.8605 0.506148 26.2001 0.649354 26.4511 0.900428L34.0994 8.5565ZM22 0.5V10.625C22 11.9324 23.0676 13 24.375 13H34.5V38.125C34.5 38.8879 33.8879 39.5 33.125 39.5H6.875C6.11208 39.5 5.5 38.8879 5.5 38.125V1.875C5.5 1.11208 6.11208 0.5 6.875 0.5H22Z" stroke="#000624"/>
        </svg>
        <p class="emailSuggestionLayoutText">No Data</p>
        </div>
</div> 

</secton><div class="createnewemail d-flex py-3 mt-3" onclick="hidesuggestion()" style="
   border-top: 1px solid #e0e3e6;
   gap: 10px;
   justify-content: center;
   cursor: pointer;
   ">
   <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none" style="
         margin-top: -4px;
         ">
         <rect x="0.666626" y="4.93359" width="10.6667" height="2.13333" fill="#0E62E8"></rect>
         <rect x="7.06738" y="0.666016" width="10.6667" height="2.13333" transform="rotate(90 7.06738 0.666016)" fill="#0E62E8"></rect>
      </svg>
   </div>
   <div>
      <p style="
         color: var(--primay-blue-500-main, #116DFF);
         /* Body Text/Regular */
         font-family: Open Sans;
         font-size: 15px;
         font-style: normal;
         font-weight: 400;
         line-height: 20px; /* 142.857% */
         ">(Create New Contact)</p>
   </div>`;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Function to hide email suggestions
function hideEmailSuggestions() {
  document.getElementById("emailSuggestions").style.display = 'none';
}

// Function to fill user data into corresponding input fields
function fillUserData(first_name, last_name, phoneNumber, email) {
  document.getElementById("clientName").value = first_name + ' ' + last_name;
  document.getElementById("emailAddress").value = email;

  // Check if phoneNumber is defined before setting its value
  if (phoneNumber !== undefined && phoneNumber !== null && phoneNumber !== "undefined") {
    document.getElementById("phoneNumber").value = phoneNumber;
  } else {
    // If phoneNumber is not found or undefined, leave the phone field empty
    document.getElementById("phoneNumber").value = '';
  }

  document.getElementById("emailSuggestions").innerHTML = '';
}

function salesPersonEdit(salesPerson){
    if(salesPerson){
      // Fetch user data from the provided API
    // fetch(`https://owlapplicationbuilder.com/api/entities/simpler_digital_marketing_1580295343903_96/users/get_all_en?page=1&page_size=95&fld=_id&srt=-1&to_search={"token":"${salesPerson}"}&t=true`)
    fetch(`https://owlapplicationbuilder.com/appsbuilder/1633421630718/objectsbuilder/api/entities/meta_team/get_all_en?page=1&page_size=8&fld=_id&srt=-1&bpjwttokenforapicall=true&to_search={%22token%22:%221699359131911%22}&t=true`)
      .then(response => response.json())
      .then(data => {
        console.log("User data:", data);
        var selectUser = document.getElementById('selectUser');
        var selectedSalesPerson = data.data[0].all_employees;
        var specificEmployee = selectedSalesPerson.find(employee => employee.value === salesPerson);
        if (specificEmployee) {
          console.log("Specific Employee:", specificEmployee);
        selectUser.value = specificEmployee.value;
        }
      })
      .catch(error => {
        console.error('Error fetching Sales Managers\' names:', error);
      });
    }
}
// End Function to fetch email suggestions based on the entered email

 var isUserNamesFetched = false; // To track whether user names are fetched to avoid multiple requests

function fetchUserNames() {
  // Check if user names are already fetched
  if (!isUserNamesFetched) {
    var selectUser = document.getElementById("selectUser");
    // Fetch user data from the provided API
    // fetch(`https://owlapplicationbuilder.com/api/entities/simpler_digital_marketing_1580295343903_96/users/get_all_en?page=1&page_size=95&fld=_id&srt=-1&to_search={}&t=true`)
    fetch(`https://owlapplicationbuilder.com/appsbuilder/1633421630718/objectsbuilder/api/entities/meta_team/get_all_en?page=1&page_size=8&fld=_id&srt=-1&bpjwttokenforapicall=true&to_search={%22token%22:%221699359131911%22}&t=true`)
      .then(response => response.json())
      .then(data => {
        console.log("sale User data:", data);

        var salesManagerData = data.data[0].all_employees;
        console.log("User salesManagerData:", salesManagerData);

        // Populate the select element with Sales Managers' names
        salesManagerData.forEach(user => {
          var option = document.createElement("option");
          option.value = user.value;
          option.text = user.label;
          selectUser.add(option);
        });

        isUserNamesFetched = true; // Set the flag to true to avoid fetching multiple times
      })
      .catch(error => {
        console.error('Error fetching Sales Managers\' names:', error);
      });
    

  }
}

fetchUserNames()


function showServiceForm(){
  document.querySelector('.service-form').style.cssText = `display: block !important;`;
}
        
function appendServices(){
  // Fetch data from the API
fetch('https://owlapplicationbuilder.com/api/entities/simpler_digital_marketing_1580295343903_96/services/get_all_en?page=1&page_size=115&fld=_id&srt=-1&to_search={}&t=true')
    .then(response => response.json())
    .then(data => {
        // Assuming 'data' is an array of objects containing 'service' information
        var item = data.data;
        console.log(item)
        // Get the select element
        var selectService = document.getElementById('selectService');

        // Loop through the 'data' and create an option for each service
        item.forEach(service => {
            // Create an option element
            var option = document.createElement('option');
            option.value = service.token; // Assuming '_id' is the value you want to assign
            option.textContent = service.title; // Assuming 'name' is the display text
            option.setAttribute('data-price', service.price);
            option.setAttribute('data-type', service.recurring);
            option.setAttribute('data-title', service.title);
            option.setAttribute('data-desc', service.description);
            option.setAttribute('data-id', service.token);
            option.setAttribute('data-planRenewal', service.planRenewal_key);

            // Append the option to the select element
            selectService.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

}

appendServices()

function addSystemService() {
    var selectService = document.getElementById('selectService');
    var selectedOption = selectService.options[selectService.selectedIndex];

    var price = selectedOption.getAttribute('data-price');
    var type = selectedOption.getAttribute('data-type');
    var title = selectedOption.getAttribute('data-title');
    var desc = selectedOption.getAttribute('data-desc');
    var token = selectedOption.getAttribute('data-id');
    var planRenewal = selectedOption.getAttribute('data-planrenewal');

    var ty = ''
    if(type == 'true'){
      ty = 'Recurring Payment'
    }else{
      ty = 'One Time Payment';
    }
    var table = document.querySelector('.table tbody');
    var newRow = document.createElement('tr');
    var titleCell = document.createElement('td');
    var descCell = document.createElement('td');
    var typeCell = document.createElement('td');
    var priceCell = document.createElement('td');
    var deleteButtonCell = document.createElement('td');
    var deleteButton = document.createElement('button');
    
    // Set the content for the table data cells
    titleCell.textContent = title;
    descCell.textContent = desc;
    typeCell.textContent = ty;
    priceCell.textContent = '$' + price;
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.setAttribute('data-token', token);
    
    // Append the delete button to its cell
    deleteButtonCell.appendChild(deleteButton);
    
    // Append table data cells to the table row
    newRow.appendChild(titleCell);
    newRow.appendChild(descCell);
    newRow.appendChild(typeCell);
    newRow.appendChild(priceCell);
    newRow.appendChild(deleteButtonCell);
    
    // Append the new row to the table body
    table.appendChild(newRow);
    console.log('Price:', price);
    console.log('Type:', type);
    console.log('Title:', title);
    console.log('ID:', token);
  var service = {
     price: price,
     type: type,
     title: title,
     desc: desc,
    token: token,
    planCencellation,
    planRenewal,
  };
  var selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];

  // Push the 'service' object into the array
  selectedServices.push(service);
  
  // Store the updated 'selectedServices' array in local storage
  localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  var totalPrice = getTotalPriceFromLocalStorageAsString();
  console.log('Total Price from selected services:', totalPrice);
  document.querySelector('.subTotalP b').innerHTML = `$ ${totalPrice}`;
  document.querySelector('.TotalP b').innerHTML = `$ ${totalPrice}`;
    deletedSelectedServices()
}


function deletedSelectedServices(){
    var deleteAddedServices =  document.querySelectorAll('.delete');
    deleteAddedServices.forEach((del) => {
      var deleteToken = del.getAttribute('data-token');
      console.log(deleteToken)
        del.addEventListener('click', () => {
            var rowToDelete = del.parentElement.parentElement;
            rowToDelete.remove();
            var selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
            selectedServices = selectedServices.filter(service => service.token !== deleteToken);
            localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
            var totalPrice = getTotalPriceFromLocalStorageAsString();
            console.log('Total Price from selected services:', totalPrice);
            document.querySelector('.subTotalP b').innerHTML = `$ ${totalPrice}`;
            document.querySelector('.TotalP b').innerHTML = `$ ${totalPrice}`;
        });
    });

}

deletedSelectedServices()
function getTotalPriceFromLocalStorageAsString() {
    var selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    var totalPrice = 0;
    console.log(selectedServices)
    // Iterate through each service in the selectedServices array
    selectedServices.forEach(service => {
      var priceAsNumber = parseInt(service.price);
        console.log(priceAsNumber)
            totalPrice += priceAsNumber;
        
    });

    // Convert totalPrice back to a string before returning
    return totalPrice.toString();
}


var saveServiceBtn = document.querySelector('.save');
saveServiceBtn.addEventListener('click', ()=>{
  console.log("saving serives in local");
  var serviceTitleCustom = document.querySelector('#serviceTitleCustom').value;
  var serviceDescCustom = document.querySelector('#serviceDescCustom').value;
  var selectPaymentType = document.querySelector('#selectPaymentType').value;
   var selectPlanRenValue = document.querySelector('#selectPlanRen').value;

  var servicePrice = document.querySelector('#servicePrice').value;
  var token = Date.now().toString();
  var planCencellation = '';
  var planReneval = '';
  var intervalUnit = '';
  var inputValue = '';
  if(selectPaymentType == 'recurring'){
    planCencellation = document.querySelector('#selectPlanCen').value;
    planRenewal = document.querySelector('#selectPlanRen').value;
    intervalUnit = document.getElementById('interval').value;
    inputValue = document.getElementById('intervalInput').value;
  }
  var ty = ''
  var tyName = ''
    if(selectPaymentType == 'recurring'){
      ty = 'true'
      tyName = 'Recurring Payment';
    }else{
      ty = 'false';
      tyName = 'One Time Payment';
    }
    
    var table = document.querySelector('.table tbody');
    var newRow = document.createElement('tr');
    var titleCell = document.createElement('td');
    var descCell = document.createElement('td');
    var typeCell = document.createElement('td');
    var priceCell = document.createElement('td');
    var deleteButtonCell = document.createElement('td');
    var deleteButton = document.createElement('button');
    
    // Set the content for the table data cells
    titleCell.textContent = serviceTitleCustom;
    descCell.textContent = serviceDescCustom;
    typeCell.textContent = tyName;
    priceCell.textContent = '$' + servicePrice;
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.setAttribute('data-token', token);
    
    // Append the delete button to its cell
    deleteButtonCell.appendChild(deleteButton);
    
    // Append table data cells to the table row
    newRow.appendChild(titleCell);
    newRow.appendChild(descCell);
    newRow.appendChild(typeCell);
    newRow.appendChild(priceCell);
    newRow.appendChild(deleteButtonCell);
    
    // Append the new row to the table body
    table.appendChild(newRow);
    
var service = {
    price: servicePrice,
    type: ty,
    title: serviceTitleCustom,
    desc: serviceDescCustom,
    token: token,
};

if (ty === 'true') {
    service.planCencellation = planCencellation;
    service.planRenewal = planRenewal;
    service.intervalUnit = intervalUnit;

    if (planRenewal === 'custom') {
        service.intervalUnit = intervalUnit;
        service.inputValue = inputValue;
    }
}



  
  var selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
   selectedServices.push(service);
  localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  var totalPrice = getTotalPriceFromLocalStorageAsString();
  console.log('Total Price from selected services:', totalPrice);
  document.querySelector('.subTotalP b').innerHTML = `$ ${totalPrice}`;
  document.querySelector('.TotalP b').innerHTML = `$ ${totalPrice}`;
  document.querySelector('#serviceTitleCustom').value = '';
  document.querySelector('#serviceDescCustom').value = '';
  // document.querySelector('#servicePrice').value = '';
  deletedSelectedServices()
  
})


function pcAndPr(){
  var selectedPaymentType = document.querySelector('#selectPaymentType');
  selectedPaymentType.addEventListener('change', ()=>{
    if (selectedPaymentType.value == 'recurring'){
      document.querySelector('.pr').classList.remove('d-none');
      document.querySelector('.pc').classList.remove('d-none');
      planCencellation()
      planReneval()
    }else{
      document.querySelector('.pr').classList.add('d-none');
      document.querySelector('.pc').classList.add('d-none');
    }
  })
}

pcAndPr()


function customRecurring(){
  var selectPlanRen = document.querySelector('#selectPlanRen');
  selectPlanRen.addEventListener('change', ()=>{
    if (selectPlanRen.value == 'custom'){
      document.querySelector('.interval').classList.remove('d-none');
     
    }else{
      document.querySelector('.interval').classList.add('d-none');
    }
  })
}

customRecurring()

function planReneval() {
  fetch('https://owlapplicationbuilder.com/api/entities/simpler_digital_marketing_1580295343903_96/plan_renewal/get_all_en?page=1&page_size=115&fld=_id&srt=-1&to_search={"status":"published"}&t=true')
    .then(response => response.json())
    .then(data => {
        // Assuming 'data' is an array of objects containing 'service' information
        var item = data.data;
        console.log(item)
        // Get the select element
        var selectService = document.getElementById('selectPlanRen');

        // Loop through the 'data' and create an option for each service
        item.forEach(service => {
            // Create an option element
            var option = document.createElement('option');
            option.value = service.slug;
            option.textContent = service.title;
            selectService.appendChild(option);
        });

        // Add a custom option at the end
        var customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Custom';
        selectService.appendChild(customOption);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}



function planCencellation() {
  fetch('https://owlapplicationbuilder.com/api/entities/simpler_digital_marketing_1580295343903_96/plan_cancellation/get_all_en?page=1&page_size=115&fld=_id&srt=-1&to_search={}&t=true')
    .then(response => response.json())
    .then(data => {
      // Assuming 'data' is an array of objects containing 'service' information
      var item = data.data;

      // Find the item with the specified token
      var selectedItem = item.find(service => service.token === '1582031170032');
        console.log('selectedItem', selectedItem);

      if (selectedItem) {
        // Get the select element
        var selectService = document.getElementById('selectPlanCen');

        // Create an option element for the selected item
        var option = document.createElement('option');
        option.value = selectedItem.token;
        option.textContent = selectedItem.title;

        // Append the option to the select element
        selectService.appendChild(option);
      } else {
        console.error('Data for token 1582031170032 not found.');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}



function hidesuggestion() {
    console.log("run");
    var emailSuggestionshide = document.getElementById('emailSuggestions');
    emailSuggestionshide.style.display = "none";
}


function toggleCustomService() {
    var customServiceCollapse = document.getElementById('customServiceCollapse');

    // Toggle the display property between "block" and "none"
    customServiceCollapse.style.display = (customServiceCollapse.style.display === 'none' || customServiceCollapse.style.display === '') ? 'block' : 'none';
}

// Assuming you have an element with id "customServiceHeading" that triggers the function on click
var customServiceHeading = document.getElementById('customServiceHeading');

// Add a click event listener to the element
customServiceHeading.addEventListener('click', toggleCustomService);


// Character LImit 

