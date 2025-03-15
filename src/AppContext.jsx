import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [tasks, setTasks] = useState([]);
  const socket = io(backendUrl);

  const getAllTasks = async () => {
    try {
      const response = await axios.get(`${backendUrl}/tasks`);
      setTasks(response.data);
    } catch (error) {
      toast.error(error.error);
    }
  };

  useEffect(() => {
    getAllTasks();

    socket.on("taskCreated", (newTask) => {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      // toast.success("New Task Added! ");
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      // toast.info("Task Deleted! ");
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskDeleted");
    };
  }, []);

  const value = {
    tasks,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
