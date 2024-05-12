import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: sessionStorage.getItem("Authorization"),
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: "Failed to load users",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: sessionStorage.getItem("Authorization"),
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/chat/group",
        {
          name: groupChatName,
          userIds: selectedUsers.map((u) => u.id),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleAddUser = (user) => {
    if (selectedUsers.filter((selUser) => selUser.id === user.id).length > 0) {
      toast({
        title: "User already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleDelete = (user) => {
    setSelectedUsers((prev) => {
      return prev.filter((ele) => ele.id !== user.id);
    });
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                mb={1}
                placeholder="Add users eg: Yash, Rahul"
                value={search}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user.id}
                  handleFunction={() => handleDelete(user)}
                  user={user}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  handleClick={() => {
                    handleAddUser(user);
                  }}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
