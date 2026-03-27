import React, { useContext, useRef, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CharAvatar from "../Cards/CharAvatar";
import axios from "../../api/axios";
import { FiUpload } from "react-icons/fi";

const SideMenu = ({ activeMenu }) => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Upload State & Ref
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    clearUser();
    navigate("/login");
  };

  // Trigger the hidden file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle the actual file selection and API call
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.patch("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update the UI immediately with the new image
      updateUser(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Clear the input so the user can upload the exact same file again if needed
      e.target.value = null;
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {/* 1. User Profile Display (No click logic here anymore) */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profile_image_url ? (
          <img
            src={user?.profile_image_url}
            alt="Profile"
            className="w-20 h-20 bg-slate-100 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <CharAvatar
            fullname={user?.name || "User"}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}
        <h5 className="text-gray-950 font-medium leading-6">
          {user?.name || ""}
        </h5>
      </div>

      {/* 2. Standard Menu Items */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 cursor-pointer text-[15px] ${
            activeMenu === item.label
              ? "text-white bg-primary"
              : "text-gray-700 hover:bg-gray-50"
          } py-3 px-6 rounded-lg mb-3 transition-colors`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      <hr className="my-4 border-gray-200" />

      {/* 3. The New "Update Picture" Button */}
      <button
        className="w-full flex items-center gap-4 cursor-pointer text-[15px] py-3 px-6 rounded-lg mb-3 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        onClick={handleUploadClick}
        disabled={uploading}
      >
        <FiUpload className="text-xl" />{" "}
        {uploading ? "Uploading..." : "Update Picture"}
      </button>

      {/* 4. Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default SideMenu;
