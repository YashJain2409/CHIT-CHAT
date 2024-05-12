import {
  Box,
  Button,
  Input,
  Menu,
  Text,
  Tooltip,
  useToast,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  useDisclosure,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../ChatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();

  const logoutHandler = async () => {
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("Authorization");
    await axios.get("http://localhost:8080/logout", { withCredentials: true });
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: sessionStorage.getItem("Authorization"),
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: sessionStorage.getItem("Authorization"),
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/chat",
        { userId },
        config
      );
      if (!chats.find((c) => c.id === data.id)) setChats([data, ...chats]);
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (err) {
      toast({
        title: "Error Fetching Chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        w="100%"
        bg="white"
        p="5px 10px 5px 10px"
        justifyContent="space-between"
        alignItems="center"
        borderWidth="5px"
      >
        <Tooltip label="search users to chat" hasArrow>
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chit-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {notifications.length === 0 && "No new messages"}
              {notifications.map((notif) => {
                return (
                  <MenuItem
                    key={notif.chat.id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(
                        notifications.filter((n) => n !== notif)
                      );
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                bg="white"
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer onClose={onClose} isOpen={isOpen} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" mb={2}>
              <Input
                mr="2"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user.id}
                    user={user}
                    handleClick={() => accessChat(user.id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
