const addToCartButtons = document.getElementsByClassName("add-to-cart-button");
Array.from(addToCartButtons).forEach((button) => {
  button.addEventListener("click", async (event) => {
    const productId = event.target.id;
    console.log(productId);
  });
});