const socket = io()

const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const cartId = button.dataset.cartid;
        const productID = button.dataset.pid;
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productID}`, {
                method: "DELETE",
            });
            if (response.ok) {
                console.log("Product removed from cart");
            } else {
                console.error("Failed to remove product from cart");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
});


socket.on('realtimeCart', (products) => {
    const newCart = document.getElementById('realTimeCart')

    let html = '';
    products.forEach((product) => {
        html += `<tr>
        <td><img src="${product.thumbnail}" style="width: 5rem;" alt="no image"></td>
            <td>${product.title}</td>
            <td>${quantity}</td>
            <td>${product.price}</td>
            <td>${totalPrice}</td>
            <td>
                <button class="btn btn-danger delete-btn" data-cartid="${cartId}" data-pid="${product._id}">Delete</button>
            </td>
            </tr> `
    })
    newCart.innerHTML = html
});