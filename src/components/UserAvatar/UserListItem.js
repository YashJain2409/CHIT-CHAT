import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleClick }) => {
  return (
    <Box
      onClick={handleClick}
      display="flex"
      w="100%"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      cursor="pointer"
      bg="#E8E8E8"
      borderRadius="lg"
      _hover={{ color: "white", background: "#38B2AC" }}
    >
      <Avatar mr={2} cursor="pointer" name={user.name} src={user.pic} />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
