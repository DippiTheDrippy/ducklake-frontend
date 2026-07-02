import type { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Browse from "./pages/Browse";
import Dataset from "./pages/Dataset";
import Favorites from "./pages/Favorites";
import Credentials from "./pages/Credentials";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: "browse", element: <Browse /> },
      { path: "datasets/:id", element: <Dataset /> },
      { path: "favorites", element: <Favorites /> },
      { path: "keys", element: <Credentials /> },

      { path: "*", element: <NotFound /> },
    ],
  },
];
