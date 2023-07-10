const socket = io();

socket.on('products',data=>{
    const finalContent = document.getElementById('productsContent');
    let content = "";
    data.forEach(product =>{
        content+=`
        <div>
            <h4>${product.title}  (${product.description}) Precio: $${product.price}</h4>
        </div>
        `;
    })
    finalContent.innerHTML = content;
})