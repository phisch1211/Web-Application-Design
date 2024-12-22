import React from 'react';
import BooksImage from './Books.jpg'; 
import Image from 'react-bootstrap/Image';

const Homepage = () => {
    return (
        <div>
            <Image src={BooksImage} alt="Books" fluid="true" style={{ maxHeight: '300px', width: 'auto', height: 'auto' }} />
            <p >The reason to create this system is to make looking for books online more 
interesting. While people are searching for a book online, they often get 
distracted by popular titles or well-known authors, instead of reading the books 
descriptions. In some bookstores, readers can buy books hidden underneath 
wrapping paper. The only available information about the book is a description 
written by the employees of the store. This system is supposed to be a digital 
version of this. Users describe their impression of a book they like, list some 
similar books from the same genre and add a link for a website to be the book for 
interested people. Other users can read descriptions and decide whether to buy 
the book or look for another one. The Admin is responsible for checking the book 
descriptions and deleting those which include information like title and author.
</p>
        </div>
    );
};

export default Homepage;