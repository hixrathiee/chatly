import React, { useEffect, useRef, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react'
import dp from "../assets/dp.jpeg"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import { serverUrl } from '../main';
import axios from 'axios';
import { addMessage } from '../redux/messageSlice';

function MessageArea() {

  const dispatch = useDispatch()
  const { selectedUser, userData, socket } = useSelector(state => state.user)
  const { messages } = useSelector(state => state.message)

  const [showPicker, setShowPicker] = useState(false)
  const [input, setInput] = useState("")
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)

  const image = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  const getMessageDateLabel = (date) => {
    const today = new Date();
    const msgDate = new Date(date);

    const isToday =
      msgDate.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday =
      msgDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return msgDate.toLocaleDateString();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input && !backendImage) return

    try {
      const formData = new FormData()
      formData.append("message", input)
      if (backendImage) formData.append("image", backendImage)

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      )

      dispatch(addMessage(result.data))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)

    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji)
    setShowPicker(false)
  }

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      if (
        mess.sender === selectedUser?._id &&
        mess.receiver === userData?._id
      ) {
        dispatch(addMessage(mess));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);

  }, [socket, selectedUser, userData]);

  return (
    <div
      className={`lg:w-[70%] w-full h-full flex flex-col bg-[#f4f6f8] ${selectedUser ? "flex" : "hidden lg:flex"}`}
    >
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="h-[80px] bg-[#1797c2] shadow-md flex items-center px-6 gap-4">

            {/* Back Arrow */}
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoArrowBack className="w-6 h-6 text-white" />
            </div>

            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
              <img
                src={selectedUser?.image || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-white font-semibold text-2xl tracking-wide">
              {selectedUser?.name || "User"}
            </h1>
          </div>

          {/* Messages Area */}

          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4">
            {messages?.map((mess, index) => {
              const currentLabel = getMessageDateLabel(mess.createdAt);

              const previousMessage = messages[index - 1];
              const previousLabel = previousMessage
                ? getMessageDateLabel(previousMessage.createdAt)
                : null;

              const showDate = currentLabel !== previousLabel;

              return (
                <React.Fragment key={mess._id}>
                  {showDate && (
                    <div className="flex justify-center my-8">
                      <div className="bg-slate-300/40 text-slate-700 text-md font-semibold px-5 py-3 rounded-full backdrop-blur-sm shadow-sm">
                        {currentLabel}
                      </div>
                    </div>
                  )}

                  {mess.sender === userData._id ? (
                    <SenderMessage
                      image={mess.image}
                      message={mess.message}
                      createdAt={mess.createdAt}
                    />
                  ) : (
                    <ReceiverMessage
                      image={mess.image}
                      message={mess.message}
                      createdAt={mess.createdAt}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Input Section */}
          <div className="px-8 py-8 bg-white border-t border-slate-200 relative">

            {showPicker && (
              <div className="absolute bottom-[95px] left-[40px] z-50">
                <EmojiPicker
                  width={250}
                  height={350}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {frontendImage && (
              <img
                src={frontendImage}
                alt=""
                className="w-20 mb-3 rounded-lg shadow-md"
              />
            )}

            {/* Branded Input */}
            <form
              className="flex items-center gap-4 bg-[#1797c2] rounded-full px-5 py-5 shadow-md"
              onSubmit={handleSendMessage}
            >
              <RiEmojiStickerLine
                className="w-7 h-7 text-white cursor-pointer"
                onClick={() => setShowPicker(prev => !prev)}
              />

              <input
                type="file"
                accept="image/*"
                ref={image}
                hidden
                onChange={handleImage}
              />

              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-white placeholder-white/70 text-2xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <FaImages
                className="w-7 h-7 text-white cursor-pointer"
                onClick={() => image.current.click()}
              />

              {(input || backendImage) && (
                <button type="submit">
                  <IoMdSend className="w-6 h-6 text-white" />
                </button>
              )}
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-slate-600 mb-4">
            Welcome to Chatly
          </h1>
          <p className="text-xl text-slate-500">
            Start a conversation from the sidebar
          </p>
        </div>
      )}
    </div>
  )
}

export default MessageArea