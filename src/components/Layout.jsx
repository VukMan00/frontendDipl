import React from 'react';
import {Outlet} from "react-router-dom";

/*
Outlet predstavlja decu App komponente
*/

const Layout = () => {
  return (
    <main className='App'>
      <Outlet />
    </main>
  )
}

export default Layout
