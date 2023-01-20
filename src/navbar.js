import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add">Add</Link>
        </li>
        <li>
          <Link to="/notifhome">Notif Home</Link>
        </li>
        <li>
          <Link to="/notifadd">Notif Add</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;