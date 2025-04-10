import React from "react";

const UserManagementPage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Management</h1>
      <p className="text-gray-600">
        Here you can manage all your user permission roles.
        <br />
        <span className="text-blue-600 font-medium">
          Feature still in development.
        </span>
      </p>
    </div>
  );
};

export default UserManagementPage;
