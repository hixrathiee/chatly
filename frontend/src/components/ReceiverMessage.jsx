import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.jpeg";
import { useSelector } from "react-redux";

function ReceiverMessage({ image, message, createdAt }) {
  const scrollRef = useRef();
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      ref={scrollRef}
      className="flex items-end gap-3 animate-slideUp"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
        <img
          src={selectedUser?.image || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Message Bubble */}
      <div className="max-w-[85%] bg-white text-gray-800 px-6 py-4 rounded-3xl rounded-bl-md shadow-sm">

        {image && (
          <img
            src={image}
            alt=""
            className="w-56 rounded-xl mb-2"
          />
        )}

        {/* Message + Time Inline */}
        <div className="flex items-end justify-between gap-3">
          <span className="text-lg leading-relaxed break-words">
            {message}
          </span>

          <span className="text-sm text-gray-500 whitespace-nowrap">
            {formatTime(createdAt)}
          </span>
        </div>

      </div>
    </div>
  );
}

export default ReceiverMessage;