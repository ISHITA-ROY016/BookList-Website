// Book class : Represent a book
class Book {
    constructor(title, author, description, rating) {
        this.title = title
        this.author = author
        this.description = description
        this.rating = rating
    }
}




// UI class: Handle UI tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks()

        books.forEach((book) => UI.addBookTOList(book))
    }

    
    static addBookTOList(book) {
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.description}</td>
        <td>${book.rating}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }


    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form)

        // vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearField() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#description').value = ''
        document.querySelector('#rating').value = ''

    }


}






// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    // prevent actual submit
    e.preventDefault()
    // get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const description = document.querySelector('#description').value
    const rating = document.querySelector('#rating').value


    // validate
    if (title === '' || author === '' || rating === '') {
        UI.showAlert('Please fill in all fields', 'danger')
    }
    else {
        // Instantiate book
        const book = new Book(title, author, description, rating)

        // Add book to Ui
        UI.addBookTOList(book)

        // Add book to store
        Store.addBooks(book)

        // show success message
        UI.showAlert('Book Added', 'success')

        // Clear field
        UI.clearField()
    }
})


// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // remove book from UI
    UI.deleteBook(e.target)

    // Remove book from store
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent)

    // show success message
    UI.showAlert('Book removed', 'success')
})





// Store class: Takes cares of storage; local storage
class Store {
    static getBooks() {
        let books
        if (localStorage.getItem('books') === null) {
            books = []
        }
        else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }

    static addBooks(book) {
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBooks(rating) {
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if (book.rating === rating) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }
}