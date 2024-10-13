import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import React from "react";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import NewPost from "./pages/newPost/NewPost";
import UpdatePost from "./pages/newPost/UpdatePost";
import Home from "./pages/home/Home";
import OwnPost from "./pages/ownPost/OwnPost";
import PersonalSetting from "./pages/personalSetting/PersonalSetting";
import FollowedPost from "./pages/followedList/FollowedPosts";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Detail from "./pages/detail/Detail";
import SearchResults from "./pages/search/SearchResults";
import PostsByTag from "./pages/themesPosts/PosTag";
import UserProfile from "./pages/userProfile/UserProfile";
import FavoritesList from "./pages/favorites/Favoriteslist";
import Information from "./pages/information/Information";
import WeatherInfo from "./pages/weatherInfo/WeatherInfo";
import ChatPage from "./pages/chatbot/ChatPage";
import Vision from "./pages/vision/Vision";
import SubscribeForm from "./components/subscribe/SubscribeForm";
import YelpInfoPage from "./components/yelpSearch/YelpInfoPage";
// import QuestionForm from './pages/questionForm/QuestionForm'

// import SearchInputFilter from './components/search/SearchInputFilter'

// allows nested UI to show up when child routes are rendered.
const Layout = () => {
  return (
    <>
      <Navbar />
      {/* <SearchInputFilter/> */}
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/singlepost/:id",
        element: <Detail />,
      },

      {
        path: "/userpost/:uid",
        element: <OwnPost />,
      },
      {
        path: "/usersetting/:uid", // usersetting/3
        element: <PersonalSetting />,
      },
      {
        path: "/user/:userId", // users/3
        element: <UserProfile />,
      },
      {
        path: "/followerpost/:uid",
        element: <FollowedPost />,
      },
      {
        path: "/favorites/:userid",
        element: <FavoritesList />,
      },
      {
        path: "/write",
        element: <NewPost />,
      },
      {
        path: "/update",
        element: <UpdatePost />,
      },
      // {
      //   path: '/qa',
      //   element: <QuestionForm />
      // },
      {
        path: "/search",
        element: <SearchResults />,
      },
      // {
      //   path: '/location',
      //   element: <TravelMap />
      // },
      {
        path: "/posts/tag/:tid",
        element: <PostsByTag />,
      },
      {
        path: "/weather_info",
        element: <WeatherInfo />,
      },
      {
        path: "/information",
        element: <Information />,
      },

      {
        path: "/subscribe",
        element: <SubscribeForm />,
      },
      {
        path: "/yelpsearch",
        element: <YelpInfoPage />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/vision",
        element: <Vision />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}
export default App;
