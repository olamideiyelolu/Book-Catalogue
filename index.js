//NPM imports
import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import pg from "pg"

const app = express()
const port = 3000


//Middleware to parse http request
app.use(bodyParser.urlencoded({ extended: true }));

//This enables static files (css) to work with non-static file(ejs)
app.use(express.static("public"));

// Initaialize a new Postgresql client instance to connect to a specified database on a specified port
const db = new pg.Client({
    user: "postgres", // Default database username
    host: "localhost", // Database server location
    database: "book-catalogue", //Database Name
    password: "notMyPassword", // Desired password (Ususally set when postgreSQL is donwloaded)notMyPassword
    port: 5432, // Default port for PostgreSQL unless specified otherwise
})

// Establish a connection to the PostgreSQL database using the client configuration.
db.connect();



// Fetch the book cover image using the ISBN from the Open Library API
async function getbookImage(isbn) {
    const image = await axios.get("https://covers.openlibrary.org/b/isbn/"+isbn+"-M.jpg");
    return image
}

// Fetch book information using the ISBN from the Open Library API
async function getBookInfo(isbn) {
    const result = await axios.get("https://openlibrary.org/isbn/"+isbn+".json");
    return result.data.title
}

//Retrieve information from the database
async function getBookCatalogue() {
    const result = await db.query("SELECT title, image, rating, note, id FROM books ORDER BY id ASC")
    return result.rows
}


//Render the home page
app.get("/", async (req,res)=>{
    try {
        const data = await getBookCatalogue();
        res.render("index.ejs",{
            books: data
        });
    } catch (error) {
        
    }
});

// Render Catalogue entry page
app.post("/find-book", async(req,res)=>{
    try {
        const isbn = req.body.isbn;
        const bookInfo = await getBookInfo(isbn)
        const bookImage = await getbookImage(isbn)
    
        res.render("book.ejs",{
            title: bookInfo,
            image: bookImage,
            isbn: isbn
        });
    } catch (error) {
        
    } 
});


//Add a new book to the catalogue
app.post("/add", async (req,res)=>{
        const image = req.body.image;
        const title = req.body.title;
        const isbn = req.body.isbn;
        const rating = req.body.rating;
        const note = req.body.note;
    try {
        await db.query("INSERT INTO books (title, rating, image, note, isbn) VALUES ($1, $2, $3, $4, $5)",[title, rating, image, note, isbn])
        res.redirect("/") 
    } catch (err) {
        console.error(err)
        const data = await getBookCatalogue();
        res.render("index.ejs",{
            error: true,
            books: data
        });
    }
    
})

// Render page for the user to update catalogue entries
app.post("/edit", async (req,res)=>{
    const id = req.body.id
    const result = await db.query("SELECT image, note, title, rating, isbn FROM books WHERE id = $1",[id])
    const bookinfo = result.rows[0]
    res.render("book.ejs",{
        edit: true,
        title: bookinfo.title,
        image: bookinfo.image,
        note: bookinfo.note,
        rating:bookinfo.rating,
        id: id
    })
})

// Updates user's changes in the database
app.post("/update", async(req,res) =>{
    const id = req.body.id;
    const updatedRating = req.body.rating;
    const updatedNote = req.body.note;
    const result = await db.query("UPDATE books SET note = $1, rating = $2 WHERE id = $3",[updatedNote,updatedRating,id]);
    res.redirect("/");    
})

// Deletes books from the database
app.post("/delete", async (req,res)=>{
    const id = req.body.id
    const result = await db.query("DELETE FROM books WHERE id = $1",[id])
    res.redirect("/")
})

// Start the server and listen on the specified por
app.listen(port,()=>{

})