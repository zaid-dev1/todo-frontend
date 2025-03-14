import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [tasks, setTasks] = useState([]);
  const getAllTasks = async () => {
    try {
     
      const response = await axios.get(backendUrl + "/tasks");
       console.log("data", response);
        setTasks(response.data);
 
    } catch (error) {
      toast.error(error.error);
    }
  };

  const value = {
    tasks,
    setTasks,
    backendUrl,
    getAllTasks,
  };

  useEffect(() => {
    getAllTasks();
  }, []);
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
