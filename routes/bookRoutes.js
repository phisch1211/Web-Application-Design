const express = require('express')

const router = express.Router()

router.get("/", (req,res)=>{
  const id = req.params.genre_id;
  res.status(200).json({books:[{book1:'random book 1'},{book2:'random book 2'},{book3:'random book 3'}],id})
})

router.get("/:book_id", (req, res) => {
  const book_id = req.params.book_id;
  res.status(200).json({ book_id, title: "Title of book " + book_id });
});

router.put('/:id', (req, res) => {
    const {title, text, genre, link} = req.body;
    const id = req.params.id;

    if (!!title && !!text & !!genre & !!link) {
      res.status(200).json({
        message: 'Replacing successful',
        data: {
          title,
          text,
          genre,
          link,
          bookID:id
        }
      });
    } else {
      res.status(400).json({
        message: 'Invalid request data',
        data: {
          title:title,
          text:text,
          genre:genre,
          link:link,
          id
        }
      });
    }
  });

router.post('/', (req, res) => {
    const {title, text, genre, link} = req.body;
    const id = req.params.id;

    if (!!title && !!text & !!genre & !!link) {
      res.status(200).json({
        message: 'Adding successful',
        data: {
          title,
          text,
          genre,
          link,
          bookID:123
        }
      });
    } else {
      res.status(400).json({
        message: 'Invalid request data',
        data: {
          title:title,
          text:text,
          genre:genre,
          link:link
        }
      });
    }
  });  

router.delete('/:id', (req, res) => {
    const {title, reason} = req.body;
    const id = req.params.id;

    if (!!title && !!reason) {
      res.status(200).json({
        message: 'Deleting successful',
        data: {
          title,
          reason,
          bookID:id
        }
      });
    } else {
      res.status(400).json({
        message: 'Invalid request data',
        data: {
          title:title,
          reason,
          id
        }
      });
    }
  });

module.exports = router