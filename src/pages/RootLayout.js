import { Outlet } from "react-router";
import NavBar from "../components/NavBar/NavBar";

function RootLayout() {
  return (
    <div id="app">
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
