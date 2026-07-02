import type { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Browse from "./pages/Browse";
import Dataset from "./pages/Dataset";
import Favorites from "./pages/Favorites";
import Credentials from "./pages/Credentials";
import Admin from "./pages/Admin";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home />, handle: { fullWidth: true } },

      { path: "browse", element: <Browse /> },
      { path: "datasets/:id", element: <Dataset /> },
      { path: "favorites", element: <Favorites /> },
      { path: "keys", element: <Credentials /> },
      { path: "admin", element: <Admin /> },

      { path: "*", element: <NotFound /> },
    ],
  },
];
