import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function Header(){

    return (
        <header className="p-3 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <h1>Star Wars Planets</h1>
        </div>
      </div>
    </header>

        );
    }

export default Header;

