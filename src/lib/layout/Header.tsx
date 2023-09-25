import React from "react";
import { Box, Flex, HStack, Text, Avatar } from "@chakra-ui/react";
// @ts-ignore
import { Pioneer } from "@pioneer-platform/pioneer-react";
import { Link as RouterLink } from "react-router-dom";

const PROJECT_NAME = "EVM sender";
const AVATAR_IMAGE_URL = "https://openseauserdata.com/files/c4da07f911e945e383e0e87dc087ee76.gif"; // Replace with your actual avatar image URL

const HeaderNew = () => {
  return (
    <Flex
      as="header"
      alignItems="center" // Align items vertically
      justifyContent="space-between" // Spread elements horizontally
      p={5}

    >
      <HStack spacing={4}>
        <Avatar borderRadius="0" src={AVATAR_IMAGE_URL} size="lg" margin="-20px" />
        <RouterLink to="/">
          <Box
            bgGradient="linear(to-l, #7928CA,#FF0080)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="extrabold"
          >
<Text
  fontFamily="system-ui"
  fontSize="3xl"
  css={{
    background: `-webkit-linear-gradient(45deg, grey, white)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  {PROJECT_NAME}
</Text>

          </Box>
        </RouterLink>
      </HStack>
      <Pioneer />
    </Flex>
  );
};

export default HeaderNew;
