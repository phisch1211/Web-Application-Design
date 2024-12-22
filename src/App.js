import {BrowserRouter, Routes, Route} from "react-router-dom"
import Homepage from "./pages/Homepage"
import BookAddPage from "./pages/BookAddPage"
import BookList from "./pages/BookList"
import LoginPage from "./pages/LoginPage"
import NewBookList from "./pages/NewBookList"
import RegisterPage from "./pages/RegisterPage"
import UserReviews from "./pages/user/UserReviews"
import UserProfile from "./pages/user/UserProfile"
import HeaderComponent from "./components/HeaderComponent"
import FooterComponent from "./components/FooterComponent"
import NewGenre from "./pages/GenreAddPage"

function App() {
  return (
    <BrowserRouter>
    <HeaderComponent/>
    <Routes>
    <Route path="/" element={<Homepage/>}/>
    <Route path="/bookDetails" element={<BookAddPage/>}/>
    <Route path="/myBooks/:genreID/:bookID" element={<BookList/>}/>
    <Route path="/newGenre" element={<NewGenre/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/newBooks" element={<NewBookList/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/user" element={<UserProfile/>}/>
    <Route path="/user/reviews" element={<UserReviews/>}/>
    </Routes>
    <FooterComponent/>
    </BrowserRouter>
  )
}

export default App;
