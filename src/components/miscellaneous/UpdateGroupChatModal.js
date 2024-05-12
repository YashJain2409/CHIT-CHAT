import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  Box,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (u) => {
    if (selectedChat.groupAdmin.id !== user.id && u.id !== user.id) {
      toast({
        title: "Only admins can remove somenone",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/api/chat/groupremove",
        { chatId: selectedChat.id, userId: u.id },
        config
      );
      setLoading(false);
      u.id === user.id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast({
        title: "Error occured",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (u) => {
    if (
      selectedChat.users.filter((selUser) => selUser.id === u.id).length > 0
    ) {
      toast({
        title: "User already in group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedChat.groupAdmin.id !== user.id) {
      toast({
        title: "Only admins can add someone",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/api/chat/groupadd",
        { chatId: selectedChat.id, userId: u.id },
        config
      );
      setLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast({
        title: "Error occured",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
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
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: sessionStorage.getItem("Authorization"),
        },
        withCredentials: true,
      };
      const { data } = await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/api/chat/rename",
        { chatId: selectedChat.id, chatName: groupChatName },
        config
      );
      setRenameLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast({
        title: "Error occured",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

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

  return (
    <>
      <IconButton icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" pb={3} w="100%" flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  user={u}
                  key={u.id}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                onClick={handleRename}
                isLoading={renameLoading}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Box display="flex" width="100%" justifyContent="center" mt={2}>
                <Spinner size="lg" />
              </Box>
            ) : (
              searchResult?.map((user) => (
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
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
