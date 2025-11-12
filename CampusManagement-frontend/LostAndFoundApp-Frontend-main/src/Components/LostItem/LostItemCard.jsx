import React from "react";

const LostItemCard = ({
  item,
  theme = "light",
  onClick,
  currentUser,
  canMarkFound,
  onMarkFound,
}) => {
  return (
    <div
      className={`${
        theme === "light" ? "bg-white" : "bg-gray-800"
      } rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden`}
      onClick={onClick}
      data-testid={`item-card-${item?.ItemId}`}
    >
      <div className="flex">
        <div className={` ${theme === "light" ? "bg-white" : "bg-gray-800"} w-35 flex items-center justify-center flex-shrink-0 p-2`}>
          <img
            src={
              item?.imageUrl ||
              "https://placehold.co/600x400/e2e8f0/cbd5e0?text=No+Image"
            }
            alt={item?.itemName || "Lost item"}
            className="h-40 w-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="p-3 flex flex-col gap-2 w-53">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`mt-2 text-lg font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {item?.itemName || "Unnamed Item"}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </p>
              <p
                className={`${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                } text-sm`}
              >
                {item?.category || "N/A"}
              </p>
            </div>
            <div className="">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Location
              </p>
              <p
                className={`${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                } text-sm`}
              >
                {item?.location || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Date Lost
              </p>
              <p
                className={`${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                } text-sm`}
              >
                {item?.lostDate || "N/A"}
              </p>
            </div>

            {/* {currentUser?.role !== "Admin" && (
              <div className="">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkFound?.();
                  }}
                  className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition font-semibold text-xs cursor-pointer"
                >
                  Mark as Found
                </button>
              </div>
            )} */}
            {currentUser?.role === "Student" ? (
              <div className="">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkFound?.();
                  }}
                  className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition font-semibold text-xs cursor-pointer"
                >
                  Mark as Found
                </button>
              </div>
            ) : (
              <div className="">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition font-semibold text-xs cursor-pointer"
                >
                  Check Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostItemCard;
