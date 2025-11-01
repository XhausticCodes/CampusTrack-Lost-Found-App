import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { foundItemSubmission } from "../../Services/ItemService";
import { getUserDetails } from "../../Services/LoginService";
import axios from "axios";
import { ArrowLeft, CloudUpload, X } from "lucide-react";
import { ThemeContext } from "../../Context/ThemeContext";
import ReturnButton from "../Buttons/ReturnButton";

const FoundItemSubmission = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const today = new Date().toISOString().slice(0, 10);
  const fileInputRef = useRef(null);

  const [item, setItem] = useState({
    username: "",
    userEmail: "",
    itemName: "",
    category: "",
    color: "",
    brand: "",
    location: "",
    imageUrl: "",
    foundDate: today,
    status: false,
  });

  useEffect(() => {
    getUserDetails().then((response) => {
      const { username, email } = response.data;
      setItem((prev) => ({ ...prev, username, userEmail: email }));
    });
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));

    // Clear errors live when user fixes input
    if (value.trim() !== "" && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImgToCloudinary = async () => {
    if (!imageFile) return null;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "LostFoundApp");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dyowvqcsn/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      setErrors((prev) => ({ ...prev, image: "Image Upload Failed." }));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    // Fields required (image excluded)
    const requiredFields = [
      "itemName",
      "category",
      "brand",
      "color",
      "location",
      "foundDate",
    ];

    requiredFields.forEach((field) => {
      if (!item[field] || item[field].toString().trim() === "") {
        tempErrors[field] = "This field is required";
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    let imageUrl = item.imageUrl;
    if (imageFile) {
      const uploadedUrl = await uploadImgToCloudinary();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        setIsSubmitting(false);
        return;
      }
    }

    foundItemSubmission({ ...item, imageUrl })
      .then(() => {
        alert("Found Item Submitted Successfully!");
        navigate(-1);
      })
      .catch(() => alert("Submission failed. Please try again."))
      .finally(() => setIsSubmitting(false));
  };

  const { theme } = useContext(ThemeContext);

  const inputStyles =
    "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyles =
    theme === "light"
      ? "block text-sm font-semibold text-gray-700 mb-1"
      : "block text-sm font-semibold text-gray-200 mb-1";
  const errorStyles = "text-red-500 text-xs mt-1";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        theme === "light" ? "bg-gray-50" : "bg-gray-900 text-white"
      }`}
    >
      <div className="w-full max-w-6xl">
        <div className="mb-4">
          <ReturnButton />
        </div>

        <form
          onSubmit={handleSubmit}
          className={`shadow-xl rounded-2xl overflow-hidden ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Pane: Image Uploader */}
            <div
              className={`lg:col-span-2 p-8 flex flex-col justify-center ${
                theme === "light" ? "bg-gray-100" : "bg-gray-700"
              }`}
            >
              <label className={labelStyles}>Item Image (Optional)</label>
              <div className="mt-2 w-full h-64">
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className={`h-full w-full object-contain rounded-lg p-2 border-2 border-gray-300 ${
                        theme === "light" ? "bg-white" : "bg-gray-700"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload-input"
                    className={`flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
                      theme === "light"
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <CloudUpload className="w-10 h-10 mb-3" />
                      <p className="text-sm font-semibold">
                        Click to upload image
                      </p>
                      <p className="text-xs">PNG or JPG</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      id="image-upload-input"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              {errors.image && <p className={errorStyles}>{errors.image}</p>}
            </div>

            {/* Right Pane: Form Fields */}
            <div className="lg:col-span-3 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Report a Found Item
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Fill in the details of the item you found.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelStyles}>Item Name *</label>
                  <input
                    name="itemName"
                    className={inputStyles}
                    value={item.itemName}
                    onChange={onChangeHandler}
                  />
                  {errors.itemName && (
                    <p className={errorStyles}>{errors.itemName}</p>
                  )}
                </div>

                <div>
                  <label className={labelStyles}>Category *</label>
                  <input
                    name="category"
                    className={inputStyles}
                    value={item.category}
                    onChange={onChangeHandler}
                  />
                  {errors.category && (
                    <p className={errorStyles}>{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className={labelStyles}>Found Date *</label>
                  <input
                    type="date"
                    name="foundDate"
                    className={inputStyles}
                    value={item.foundDate}
                    onChange={onChangeHandler}
                  />
                  {errors.foundDate && (
                    <p className={errorStyles}>{errors.foundDate}</p>
                  )}
                </div>

                <div>
                  <label className={labelStyles}>Brand *</label>
                  <input
                    name="brand"
                    className={inputStyles}
                    value={item.brand}
                    onChange={onChangeHandler}
                  />
                  {errors.brand && (
                    <p className={errorStyles}>{errors.brand}</p>
                  )}
                </div>

                <div>
                  <label className={labelStyles}>Color *</label>
                  <input
                    name="color"
                    className={inputStyles}
                    value={item.color}
                    onChange={onChangeHandler}
                  />
                  {errors.color && (
                    <p className={errorStyles}>{errors.color}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelStyles}>Location Found *</label>
                  <input
                    name="location"
                    className={inputStyles}
                    value={item.location}
                    onChange={onChangeHandler}
                  />
                  {errors.location && (
                    <p className={errorStyles}>{errors.location}</p>
                  )}
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {isUploading
                    ? "Uploading..."
                    : isSubmitting
                    ? "Submitting..."
                    : "Submit Item"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoundItemSubmission;
