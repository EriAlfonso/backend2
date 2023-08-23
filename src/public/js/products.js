const socket = io();


document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            event.preventDefault();
            const productID = button.dataset.pid;
            const cartID = button.dataset.cartid;
            try {
                const response = await fetch(
                    `/api/carts/${cartID}/product/${productID}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ quantity: 1 }),
                    }
                );

                if (response.ok) {
                    window.location.href = "/products";
                } else {
                    console.error("Failed to add product");
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
});


const sortSelect = document.getElementById("sort");
const sortForm = document.getElementById("sortForm");

sortSelect.addEventListener("change", () => {
    sortForm.submit();
});
