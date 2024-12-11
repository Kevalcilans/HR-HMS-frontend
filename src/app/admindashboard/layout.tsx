import Sidebar from "./components/Sidebar";


// components/Layout.js
export default function Layout({ children }) {
    return (
     
  
      <div className="flex h-screen overflow-hidden">
      <Sidebar />
        {children}
      </div>
  
       
      
    );
  }
  