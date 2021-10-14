//Verificar si ID existe en los seleccionados

const buscar_item_por_id = (id) => {
  return productAll.find(function (item) {
    return item.id === id;
  });
};

//Agrega los productos a la lista de pago
const addListPayment = (retrievedObject) => {
  let rows = "";
  $.each(retrievedObject, (i, row) => {
    rows += `<tr>
              <td> ${row.cant} </td>
              <td> ${row.name} </td> 
              <td> ${row.price} </td> 
              <td><span onclick="removeProduct('${row.id}')" class="btn btn-danger">Eliminar Producto</span></td> 
          </tr>`;
  });
  $(`#tabla-pagar tbody`).append(rows);
  calcularTotal();
};

//agrega los productos al carrito
const addCard = () => {
  let addCarro = JSON.parse(localStorage.getItem("productAll"));

  let adds = "";
  $(`#lista-carrito tbody`).append(adds);
  $.each(addCarro, (i, row) => {
    adds += `<tr>
            <td> ${row.id} </td>
            <td> ${row.name} </td> 
            <td> ${row.price} </td> 
        </tr>`;
  });
  $(`#lista-carrito tbody`).append(adds);
};

//calcular Total Compra
const calcularTotal = () => {
  let total = 0;
  let retrievedObject = JSON.parse(localStorage.getItem("productAll"));
  for (let i = 0; i < retrievedObject.length; i++) {
    let element = Number(retrievedObject[i].price);
    total = total + element;
  }
  document.getElementById("total").innerHTML = "$" + total;
};

//crea las tarjetas en donde se muestran los productos
const allProducts = () => {
  $.ajax({
    type: 'GET',
    url: 'https://peaceful-citadel-68878.herokuapp.com/bsale/products',
    success: function (data) {
      let cards = "";
      $.each(data, (i, row) => {
        let pro = [row.id, row.name, row.price, row.url_image];
        cards += `
    <div class="col-md-4 mb-5">
      <div class="card" style="width: 18rem">
        <img src="${row.url_image}" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${row.name}</h5>
          <h5 class="card-title">${row.price}</h5>
          <a id="${row.id}" onclick="checket('${pro}'), addCard()" class="apretar btn btn-primary">Agregar</a>
        </div>
      </div>
    </div>`;
      });
      $(`#product`).append(cards);
    },
    error: function () {
      alert('Failed!');
    }

  });
};

//calcula los productos que tengo seleccionados
const productTotal = () => {
  let productAll = JSON.parse(localStorage.getItem("productAll"));
  let cant = document.getElementById("countProduct");
  if (productAll != null && productAll.length > 0) {
    cant.innerHTML = `<span class="cardCount">${productAll.length}</span>`;
  } else {
    cant.innerHTML = `<span class="cardCount">0</span>`;
  }
};

//boton de busqueda de productos
$("nav").on("submit", (event) => {
  event.preventDefault();
  let search = document.getElementById("search").value;
  document.getElementById("product").innerHTML = "";

  $.ajax({
    type: 'GET',
    url: `https://peaceful-citadel-68878.herokuapp.com/bsale/search/${search}`,
    success: function (data) {
      if (data != "No se encontraron resultados") {
        let cards = "";
        $.each(data, (i, row) => {
          let pro = [row.id, row.name, row.price, row.url_image];
          cards += `
            <div class="col-md-4 mb-5">
              <div class="card" style="width: 18rem">
                <img src="${row.url_image}" class="card-img-top" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">${row.name}</h5>
                  <h5 class="card-title">${row.price}</h5>
                  <a id="${row.id}" onclick="checket('${pro}'), addCard()" class="apretar btn btn-primary">Agregar</a>
                </div>
              </div>
            </div>`;
        });
        $(`#product`).append(cards);
      } else {
        let cards = "";
        cards += `<h1>No se encontraron productos</h1>`;
        $(`#product`).append(cards);
      }
    },
    error: function () {
      alert('Failed!');
    }
  });
});

//selecciona y garda productos en localstorage
let productAll = [];

function checket(item) {
  let itemProduct = item.split(",");
  const countProduct = buscar_item_por_id(itemProduct[0]);
  if (countProduct != undefined) {
    let totalPrice = parseInt(countProduct.price) + parseInt(itemProduct[2]);
    countProduct.price = totalPrice;
    countProduct.cant += 1;
  } else {
    let product = {
      id: itemProduct[0],
      name: itemProduct[1],
      price: itemProduct[2],
      img: itemProduct[3],
      cant: 1,
    };
    productAll.push(product);
  }
  // localstorage
  localStorage.setItem("productAll", JSON.stringify(productAll));
  productTotal();
}

//Eliminar productos de la tabla carrito
const removeProduct = (id) => {
  let productAll = JSON.parse(localStorage.getItem("productAll"));
  productAll = productAll.filter((item) => item.id != id);
  localStorage.setItem("productAll", JSON.stringify(productAll));
  location.reload();
};

//boton pagar de carrito
$("#pagar").click(function () {
  let cliente = document.getElementById("cliente");
  let correo = document.getElementById("correo");

  if (cliente.value === "" || correo.value === "") {
    alert("Por favor ingresar Su Nombre y Correo");
  } else {
    localStorage.clear();
    alert("Gracias por su compra");
    let rows = "";
    $(`#tabla-pagar tbody`).append(rows);
    window.location.href = "index.html";
  }
});

//funcion para filtrar productos por categoria con el select
$("#categories").change(function () {
  let id = $("#categories").val();
  document.getElementById("product").innerHTML = "";
  if (id == 8) {
    allProducts();
  } else {
    $.ajax({
      type: 'GET',
      url: `https://peaceful-citadel-68878.herokuapp.com/bsale/category/${id}`,
      success: function (data) {

        let cards = "";
        $.each(data, (i, row) => {
          let pro = [row.id, row.name, row.price, row.url_image];
          cards += `
              <div class="col-md-4 mb-5">
                <div class="card" style="width: 18rem">
                  <img src="${row.url_image}" class="card-img-top" alt="..." />
                  <div class="card-body">
                    <h5 class="card-title">${row.name}</h5>
                    <h5 class="card-title">${row.price}</h5>
                    <a id="${row.id}" onclick="checket('${pro}'), addCard()" class="apretar btn btn-primary">Agregar</a>
                  </div>
                </div>
              </div>`;
        });
        $(`#product`).append(cards);
      },
      error: function () {
        alert('Elija una Categoria');
      }
    });
  }
  //Cierre de la funcion
});

window.onload = function () {
  //funcion para buscar productos
  $("#search")
    .on("keyup", function () {
      let value = $(this).val().length;
      if (value === 0) {
        document.getElementById("product").innerHTML = "";
        allProducts();
      }
    })
    .keyup();

  let retrievedObject = JSON.parse(localStorage.getItem("productAll"));
  if (retrievedObject != null && retrievedObject.length > 0) {
    addCard();
  }

  //Revisa si hay o no productos en el carro
  const pagar = document.getElementById("tabla-pagar");
  if (pagar != null) {
    if (retrievedObject != null && retrievedObject.length > 0) {
      addListPayment(retrievedObject);
    } else {
      alert("No tienes productos para pagar");
      window.location.href = "index.html";
    }
  }
  productTotal();
};