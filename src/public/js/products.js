document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const productID = button.dataset.pid;
            const cartID = button.dataset.cartid;
            try {
                const response = await fetch(
                    `/api/carts/${cartID}/product/${productID}`,
                    // indicamos el metodo y el type
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ quantity: 1 }),
                    }
                );

                if (response.ok) {
                    console.log("Product added successfully");
                } else {
                    console.error("Failed to add product");
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
});
