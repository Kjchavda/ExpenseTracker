import React, { useContext, useRef, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CharAvatar from "../Cards/CharAvatar";
import axios from "../../api/axios"; // Ensure this points to your axios instance
import { Upload } from "lucide-react"; // Optional: icon for the hover state

const SideMenu = ({ activeMenu }) => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    logout();
    clearUser();
    navigate("/login");
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

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

      // Update the global user context with the new image URL
      updateUser(response.data);
      alert("Profile picture updated!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {/* Profile Image Container with Hover Effect */}
        <div
          className="relative group w-20 h-20 rounded-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-sm"
          onClick={handleImageClick}
        >
          {/* The Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />

          {/* The Avatar Display */}
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            {user?.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <CharAvatar
                fullname={user?.name || "User"}
                width="w-full"
                height="full"
                style="text-xl"
              />
            )}
          </div>

          {/* The Overlay (This is the "Hover Effect") */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Upload className="text-white w-5 h-5 mb-0.5" />
                <span className="text-[8px] text-white font-bold uppercase tracking-wider">
                  Edit
                </span>
              </>
            )}
          </div>
        </div>

        <h5 className="text-gray-950 font-medium leading-6">
          {user?.name || ""}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 cursor-pointer text-[15px] ${
            activeMenu === item.label ? "text-white bg-primary" : ""
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() =>
            item.path === "logout" ? handleLogout() : navigate(item.path)
          }
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
