import React from "react";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  ModalCloseButton,
  ModalContent,
  Avatar
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        ></IconButton>
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            justifyContent="space-between"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              bg="white"
              size="2xl"
              name={user.name}
              src={user.pic}
            ></Avatar>
            <Text
              fontFamily="Work sans"
              fontSize={{ base: "28px", md: "30px" }}
            >
              {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
