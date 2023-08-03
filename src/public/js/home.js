const socket = io()

document.getElementById('realTimeForm').onsubmit = e => {
    e.preventDefault()

    const title = document.querySelector('input[name=title]').value
    const description = document.querySelector('input[name=description]').value
    const price = document.querySelector('input[name=price]').value
    const thumbnail = document.querySelector('input[name=thumbnail]').value
    const code = document.querySelector('input[name=code]').value
    const stock = document.querySelector('input[name=stock]').value
    const category = document.querySelector('input[name=category]').value

    const newProduct = { title, description, price, thumbnail, code, stock, category }
    socket.emit('newProduct', newProduct)
}

socket.on('realtimetable', products => {
    const newTable = document.getElementById('realTimeTable')

    let html = '';
    products.forEach(product => {
        html += `<tr>
        <td><img src="${product.thumbnail}" style="width: 5rem;" alt="no image"></td>
    <td>${product.title}</td>
<td>${product.description}</td>
<td>${product.price}</td>
<td>${product.code}</td>
<td>${product.stock}</td>
<td>${product.category}</td>
</tr>
            `
    })
    newTable.innerHTML = html
});


