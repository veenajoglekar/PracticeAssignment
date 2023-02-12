import React, { Component, useEffect, useState } from "react";
import dashboardService from "./dashboard.service.js";
import MyModal from "./MyModal";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [createType, setCreateType] = useState("Add");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentUser, setCurrentUser]: any = useState({});
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("User added successfully");
  const [showModal, setShowModal] = useState(false);

  const columns = ["firstName", "lastName", "age", "phoneNumber", "actions"];
  const columnMappings: any = {
    firstName: "First Name",
    lastName: "Last Name",
    age: "Age",
    phoneNumber: "Phone Number",
    actions: "Actions",
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    dashboardService.getUsers().then((res) => {
      console.log(res);
      setUsers(res.data);
    });
  };

  const addUser = () => {
    let payload = {
      firstName,
      lastName,
      age,
      phoneNumber,
    };
    if (createType === "Add") {
      dashboardService.createUser(payload).then((res) => {
        console.log(res);
        setMessage("User added successfully")
        setShowToast(true);
        setShowAdd(false);
        getUsers()
      });
    } else {
      dashboardService
        .updateUser({ ...payload }, currentUser._id)
        .then((res) => {
          setMessage("User updated successfully")
          setShowToast(true);
          setShowAdd(false);

          console.log(res);
          getUsers()
        });
    }
    resetForm();
  };

  const openPopup = () => {
    console.log("add clicked");
    setCreateType("Add");
    setShowAdd(true);
  };

  const resetForm = () => {
    setCurrentUser({});
    setFirstName("");
    setLastName("");
    setAge("");
    setPhoneNumber("");
  }

  const editUser = (user: any) => {
    setCreateType("Edit");
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAge(user.age);
    setPhoneNumber(user.phoneNumber);
    setCurrentUser(user);
    setShowAdd(true);
  };

  const parentCallback = (payload:any) => {
    console.log(payload);
    switch(payload.type){
      case 'close' : 
        setShowModal(false);
        setCurrentUser({});
        break;
      case 'success':
        deleteUser(currentUser);
        setCurrentUser({});
        setShowModal(false);
    }
  }

  const openDeleteConfirmation = (user:any) => {
    setShowModal(true);
    setCurrentUser(user);
  }

  const deleteUser = (user: any) => {
    dashboardService.deleteUser(user).then((res) => {
      console.log(res);
      setMessage("User deleted successfully")
      setShowToast(true);
      getUsers();
    });
  };

  return (
    <>
      {!showAdd ? (
        <div className="relative overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              openPopup();resetForm();
            }}
            className="myBtn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add User
          </button>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {columns.map((col) => {
                  return (
                    <th scope="col" className="px-6 py-3">
                      {columnMappings[col]}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      {columns.map((col) => {
                        switch (col) {
                          case "actions":
                            return (
                              <>
                                <td className="inline-flex px-6 py-4">
                                  <div
                                    className="cp"
                                    onClick={() => {
                                      editUser(user);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                      />
                                    </svg>
                                  </div>
                                  <div
                                    className="cp"
                                    onClick={() => {
                                      openDeleteConfirmation(user);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                      />
                                    </svg>
                                  </div>
                                </td>
                              </>
                            );
                          default:
                            return <td className="px-6 py-4">{user[col]}</td>;
                        }
                      })}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="form-container relative overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setShowAdd(false);
            }}
            className="myBtn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Go Back
          </button>
            <h2 className="text-4xl font-extrabold dark:text-white mb-4 mt-4">
              {createType} User
            </h2>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                value={firstName}
                onChange={(evt) => {
                  setFirstName(evt.target.value);
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your Last Name
              </label>
              <input
                type="text"
                id="password"
                placeholder="Doe"
                value={lastName}
                onChange={(evt) => {
                  setLastName(evt.target.value);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your Age
              </label>
              <input
                type="text"
                id="age"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="21"
                value={age}
                onChange={(evt) => {
                  setAge(evt.target.value);
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your Phone Number
              </label>
              <input
                type="text"
                id="phonenumber"
                placeholder="91-1234567890"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={phoneNumber}
                onChange={(evt) => {
                  setPhoneNumber(evt.target.value);
                }}
                required
              />
            </div>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
            font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700
             dark:focus:ring-blue-800"
              onClick={() => {
                addUser();
              }}
            >
              {createType} User
            </button>
        </div>
      )}

      {
      showToast && (
        <div
          id="toast-success"
          className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">{message}.</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={()=>{setShowToast(false)}}
          >
            <div  >
              <span  className="sr-only">Close</span>

            </div>
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      )}
      <MyModal show={showModal} parentCallback={parentCallback} />
    </>
  );
};

export default Dashboard;
