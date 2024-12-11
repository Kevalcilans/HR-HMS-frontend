import Sidebar from "./component/Sidebar";

export default function Layout({ children }) {
    return (
      <div className="flex h-screen overflow-hidden">
      <Sidebar />
        {children}
      </div>
  
    );
  }
  