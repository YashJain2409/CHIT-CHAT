import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./ChatLogic";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div style={{ display: "flex" }} key={m.id}>
              {(isSameSender(messages, m, i, user.id) ||
                isLastMessage(messages, i, user.id)) && (
                <Tooltip
                  label={m.sender.name}
                  hasArrow
                  placement="bottom-start"
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    name={m.sender.name}
                    src={m.sender.pic}
                    size="sm"
                    cursor="pointer"
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender.id === user.id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  padding: "5px 15px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user.id),
                  marginTop: isSameUser(messages, m, i) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
