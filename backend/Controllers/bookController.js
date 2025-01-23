const bookModel = require('../Models/bookModel');

const addBook = async (req, res) => {
    try {
        const { title, author, isbn, publicationDate } = req.body;

        // Validate required fields
        if (!title || !author || !isbn) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }
        let formattedDate = null;
        if (publicationDate) {
            const [day, month, year] = publicationDate.split('-');
            formattedDate = new Date(`${year}-${month}-${day}`);
            if (isNaN(formattedDate)) {
                return res.status(400).json({ message: "Invalid publication date format." });
            }
        }
        const book = await bookModel.create({
            title,
            author,
            isbn,
            publicationDate: formattedDate,
        });
        res.status(201).json(book);

    } catch (error) {
        console.error(error, "Error in creating book");
        res.status(500).json({ message: "Error in creating book" });
    }
};

const allBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, sortBy = 'title', order = 'asc' } = req.query;

        // Pagination calculation
        const skip = (page - 1) * limit;

        // Build the query object for search
        const searchQuery = {};
        if (search) {
            searchQuery.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }

        // Build the sort object
        const sortOrder = order.toLowerCase() === 'desc' ? -1 : 1;
        const sortQuery = { [sortBy]: sortOrder };

        // Fetch books with pagination, search, and sorting
        const books = await bookModel
            .find(searchQuery)
            .sort(sortQuery)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        // Total count for pagination
        const totalBooks = await bookModel.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: books,
            totalBooks,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalBooks / limit),
        });
    } catch (error) {
        console.error("Error in fetching all books:", error);
        res.status(500).json({ error: 'Error in fetching books.' });
    }
};


const specificBook = async (req, res) => {
    try {
  
        const bookId = req.params.id;

  
        const book = await bookModel.findById(bookId);

        if (book) {
            return res.status(200).json({
                success: true,
                message: "Book fetched successfully.",
                data: book,
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Book not found." 
            });
        }
    } catch (error) {
        console.error("Error in specificBook API:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error in fetching book." 
        });
    }
};

const updateBookInfo=async(req,res)=>{
    try {
        const updates = req.body;
        const book = await bookModel.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!book) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.json(book);
    } catch (error) {
        console.log("error in updating book info",error)
        res.status(500).json({
            success: false,
            message: "Error in updating book info",
            });
    }
}

const deleteBook=async(req,res)=>{
    try {
        const book=await bookModel.findByIdAndDelete(req.params.id);
        if(!book){
            return res.status(404).json({error:'Book not found.'})
            }
            res.json({message:'Book deleted successfully.'})
    } catch (error) {
        console.log("error in deleting book");
        res.status(500).json({
            success: false,
            message: "Error in deleting book",
            });
    }
}

module.exports={addBook,allBooks,specificBook,updateBookInfo,deleteBook}



