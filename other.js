//Array of OBJECTS to store products information.
let products = [];

//Codes to update products array from local storage
if(localStorage.getItem("products") != null){
  products = JSON.parse(localStorage.getItem("products"));
}else{
  localStorage.setItem("products", JSON.stringify(products));
}


let filteredProducts = products;

// Paginnation Section starts here

let totalPages = null;
let currentPage = null;
let start = null;
let end = null;
let paginate = [];

function setupPagination(){
  totalPages = Math.ceil(filteredProducts.length / 5);
  document.getElementById("totalpages").innerText = totalPages;
  currentPage = 1;
  document.getElementById("currentpage").innerText = currentPage;
  start = (currentPage - 1) * 5;
  end = currentPage * 5;
  paginate = filteredProducts.slice(start, end);
}
//Paginnation Section Ends here.


//Function to DISPLAY products in table.
function display(arr){
  document.getElementById("data").innerHTML = "";
    arr.forEach(function (product, index) {
    let tr = document.createElement("tr");
    
    let numTD = document.createElement("td");
    numTD.append(index + 1);
    tr.appendChild(numTD);

    let nameTD = document.createElement("td");
    nameTD.append(product.name);
    tr.appendChild(nameTD);

    let categoryTD = document.createElement("td");
    categoryTD.append(product.category);
    tr.appendChild(categoryTD);

    let priceTD = document.createElement("td");
    priceTD.append(product.price);
    tr.appendChild(priceTD);

    let sellerTD = document.createElement("td");
    sellerTD.append(product.seller);
    tr.appendChild(sellerTD);

    let companyTD = document.createElement("td");
    companyTD.append(product.company);
    tr.appendChild(companyTD);

    let imageTD = document.createElement("td");
    let img = document.createElement("img");
    img.src = product.image;
    img.width = "60";
    img.height = "60";
    imageTD.append(img);
    tr.appendChild(imageTD);

    let actionTD = document.createElement("td");
    actionTD.style.display = "flex";
    actionTD.style.height = "5em";
    actionTD.style.justifyContent = "space-around";
    actionTD.style.alignItems = "center";

    let viewBtn = document.createElement("i");
    viewBtn.classList.add("fa", "fa-eye");
    viewBtn.style.color = "#3b8742";
    viewBtn.style.cursor = "pointer";
    viewBtn.addEventListener("click", function(){
      viewProduct(product.id);
    });
    actionTD.append(viewBtn);

    let editBtn = document.createElement("i");
    editBtn.classList.add("fa", "fa-pencil");
    editBtn.style.color = "#324170";
    editBtn.style.cursor = "pointer";
    editBtn.addEventListener("click", function(){
      setupUpdateData(product.id);
    })
    actionTD.append(editBtn);

    let deleteBtn = document.createElement("i");
    deleteBtn.classList.add("fa", "fa-trash");
    deleteBtn.style.color = "#c94040";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", function(){
      deleteProduct(product.id);
    })
    actionTD.append(deleteBtn);

    tr.appendChild(actionTD);


    document.getElementById("data").appendChild(tr);
    });
}
setupPagination();
display(paginate);


function openPage(pageNo){
  if(pageNo >=1  && pageNo <= totalPages && pageNo != "" && pageNo != null){
    document.getElementById("currentpage").innerText = pageNo;
    start = (pageNo - 1) * 5;
    end = pageNo * 5;
    paginate = filteredProducts.slice(start, end);
    display(paginate);
  }
}

function prev(){
  if(currentPage > 1){
    currentPage--;
    openPage(currentPage);
  }
}

function next(){
  if(currentPage < totalPages){
    currentPage++;
    openPage(currentPage);
  }
}



//Filter object to store READ values of input fields.
let filters = {
  name: null,
  category: null,
  priceRange: null,
  company: null,
  seller: null
};
//Function to READ values of input fields.
function readValue(e, property){
  if(e.target.value != ""){
    filters[property] = e.target.value;
  }else{
    filters[property] = null;
  }
}

//Function to FILTER OUT products from table.
function filter(){
  filteredProducts = products;
  if(filters.name !== null){
     filteredProducts= filteredProducts.filter(function(product, index){
        return filters.name.toUpperCase() == product.name.toUpperCase();
    })
  }
  if(filters.category !== null){
    filteredProducts= filteredProducts.filter(function(product, index){
        return filters.category.toUpperCase() == product.category.toUpperCase();
    })
  }
  if(filters.priceRange !== null){
    let price = filters.priceRange.split("-");
    filteredProducts= filteredProducts.filter(function(product, index){
        return product.price >= price[0] && product.price <= price[1];
    })
  }
  if(filters.company !== null){
    filteredProducts= filteredProducts.filter(function(product, index){
        return filters.company.toUpperCase() == product.company.toUpperCase();
    })
  }

  if(filters.seller !== null){
    filteredProducts= filteredProducts.filter(function(product, index){
        return filters.seller.toUpperCase() == product.seller.toUpperCase();
    })
  }
  
  if(filteredProducts.length !== 0){
    document.getElementById("message").style.display  = "none";
    setupPagination();
    display(paginate);
  }else{
    document.getElementById("data").innerHTML = "";
    document.getElementById("message").style.display = "block";
  }
}

// Function to OPEN & CLOSE modal for product adding.
function toggleModal(open, modalID){
  if(open == true){
    document.getElementById(modalID).style.display = "flex";
  }else{
    document.getElementById(modalID).style.display = "none";
  }
}

// Function to close ADD modal on click of outside area of modal_child
function closeModal(event, property){
  if(event.target.id === property){
    toggleModal(false, event.target.id);
  }
}

//Function to add data to table via modal
function addProduct(){
  let product = {};

  if(products.length !== 0){
    product.id = products[products.length - 1].id + 1;
  }else{
    product.id = 1;
  }
  product.name = document.getElementById("product_name").value;
  product.category = document.getElementById("product_category").value;
  product.price = Number(document.getElementById("product_price").value);
  product.image = document.getElementById("product_image").value;
  product.seller = document.getElementById("product_seller").value;
  product.company = document.getElementById("product_company").value;

  products.push(product);

  display(filteredProducts);

  toggleModal(false, "add_modal");

  localStorage.setItem("products", JSON.stringify(products));
}

//Function to DELETE DATA from table via delete icon.
let deleteID =null;

function deleteProduct(id){
  deleteID = id;
  toggleModal(true, "delete_modal");
}

function confirmation(status){
  if(status == true){
    let productIndex = filteredProducts.findIndex(function(product, index){
      return product.id == deleteID;
    });
    filteredProducts.splice(productIndex, 1);

    let mainProductIndex = products.findIndex(function(product, index){
      return product.id == deleteID;
    });
    products.splice(mainProductIndex, 1);
    
    localStorage.setItem("products", JSON.stringify(products));
    start = (currentPage - 1) * 5;
    end = currentPage * 5;
    paginate = filteredProducts.slice(start, end);
    display(paginate);
  }
  toggleModal(false, "delete_modal");
}



//Function to VIEW PRODUCT details on click of VIEW icon.
function viewProduct(id){
  let product = products.find(function(product, index){
    return product.id == id;
  });
  toggleModal(true, "view_modal");
  document.getElementById("pro_img").src = product.image;
  document.getElementById("pro_name").innerHTML = product.name;
  document.getElementById("seller_span").innerHTML = product.seller;
  document.getElementById("company_span").innerHTML = product.company;
  document.getElementById("price_span").innerHTML = product.price;
}

//Function to FETCH DATA for update.
let productToUpdate = null;
function setupUpdateData(id){
  productToUpdate = products.find(function(product, index){
    return product.id == id;
  });
  document.getElementById("product_name_up").value = productToUpdate.name;
  document.getElementById("product_category_up").value = productToUpdate.category;
  document.getElementById("product_price_up").value = productToUpdate.price;
  document.getElementById("product_image_up").value = productToUpdate.image;
  document.getElementById("product_seller_up").value = productToUpdate.seller;
  document.getElementById("product_company_up").value = productToUpdate.company;
  toggleModal(true, "update_modal");
}

//Function to UPDATE DATA.
function updateProduct(){
  productToUpdate.name = document.getElementById("product_name_up").value;
  productToUpdate.category = document.getElementById("product_category_up").value;
  productToUpdate.price = Number(document.getElementById("product_price_up").value);
  productToUpdate.image = document.getElementById("product_image_up").value;
  productToUpdate.seller = document.getElementById("product_seller_up").value;
  productToUpdate.company = document.getElementById("product_company_up").value;

  start = (currentPage - 1) * 5;
  end = currentPage * 5;
  paginate = filteredProducts.slice(start, end);
  display(paginate);
  toggleModal(false, "update_modal");
  localStorage.setItem("products", JSON.stringify(products));
}