import axios from "axios";
import { Button, Modal, Input, List, Form } from "antd";
import "antd/dist/reset.css";
import React, { useContext, useState } from "react";
import { AppContext } from "./AppContext";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const { tasks, backendUrl } = useContext(AppContext);
  console.log("tasks", tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [form] = Form.useForm();
  const handleAddTask = async () => {
    try {
      const values = await form.validateFields();

      try {
        await axios.post(`${backendUrl}/tasks`, {
          name: values.name,
          description: values.description,
        });

        setIsModalOpen(false);
        form.resetFields();
        toast.success("New Task Added!");
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Failed to add task!");
      }
    } catch (validationError) {
      console.log(validationError);
    }
  };

  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`${backendUrl}/tasks/${taskToDelete}`);
      setDeleteModalOpen(false);
      toast.info("Task Deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task!");
    }
  };

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <div className="container mt-10">
        <h1 className="text-2xl font-bold text-center my-4 ">To-Do List</h1>

        <div className="flex justify-center mb-4">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add New Task
          </Button>
        </div>

        <Modal
          title="Add New Task"
          open={isModalOpen}
          onOk={handleAddTask}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Task Name"
              name="name"
              rules={[{ required: true, message: "This field is required!" }]}
            >
              <Input placeholder="Enter Task Name" />
            </Form.Item>

            <Form.Item
              label="Task Description"
              name="description"
              rules={[{ required: true, message: "This field is required!" }]}
            >
              <Input placeholder="Enter Task Description" />
            </Form.Item>
          </Form>
        </Modal>

        <List
          itemLayout="horizontal"
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg mb-4 mx-4 border border-gray-200"
              style={{ padding: "10px 10px" }}
            >
              <List.Item.Meta
                title={
                  <span className="font-semibold text-lg">{task.name}</span>
                }
                description={
                  <span className="text-gray-600">{task.description}</span>
                }
              />
              <Button
                type="primary"
                danger
                onClick={() => confirmDeleteTask(task._id)}
              >
                Delete
              </Button>
            </List.Item>
          )}
          style={{ marginTop: 20 }}
        />

        <Modal
          title="Confirm Delete"
          open={deleteModalOpen}
          onOk={handleDeleteTask}
          onCancel={() => setDeleteModalOpen(false)}
          okText="Yes, Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this task?</p>
        </Modal>
      </div>
    </div>
  );
};

export default App;
