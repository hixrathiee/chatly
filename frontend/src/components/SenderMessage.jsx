import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.jpeg";
import { useSelector } from "react-redux";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";

function SenderMessage({ image, message, createdAt, status = "delivered" }) {
  const { userData } = useSelector((state) => state.user);
  const scrollRef = useRef();

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
      className="flex justify-end items-end gap-3 animate-slideUp"
    >
      {/* Message Bubble */}
      <div className="relative max-w-[85%] bg-[#1797c2] text-white px-6 py-4 rounded-3xl rounded-br-md shadow-md">

        {image && (
          <img
            src={image}
            alt=""
            className="w-56 rounded-xl mb-2"
          />
        )}

        {/* Message + Inline Time */}
        <div className="flex items-end justify-between gap-3">
          <span className="text-lg leading-relaxed break-words">
            {message}
          </span>

          <span className="flex items-center gap-1 text-sm text-white/80 whitespace-nowrap">
            {formatTime(createdAt)}

            {status === "sent" && (
              <IoCheckmark className="text-base text-white/70" />
            )}

            {status === "delivered" && (
              <IoCheckmarkDone className="text-base text-white/70" />
            )}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
        <img
          src={userData?.image || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SenderMessage;