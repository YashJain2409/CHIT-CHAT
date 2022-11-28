import { Box } from "@chakra-ui/react";
import React from "react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      cursor="pointer"
      bg="purple"
      color="white"
      m={1}
      mb={2}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
