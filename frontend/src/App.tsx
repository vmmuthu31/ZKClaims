import React from 'react'
import Claimed from './Claimed'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Collections from './Collections';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        
      <Route path="/" element={<Claimed />} />
<Route path="/collections" element={<Collections />} />
<Route path="*" element={<>No page</>} />

      </Routes>
    </BrowserRouter>
      </div>
  )
}

export default App