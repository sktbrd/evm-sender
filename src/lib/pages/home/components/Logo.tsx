import React, { useEffect } from "react";
import { Image, keyframes, usePrefersReducedMotion } from "@chakra-ui/react";
import { Howl } from "howler";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Logo = (props: any) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;

    useEffect(() => {
      console.log("Logo prop:", props.logo);
    
      try {
        if (props.logo === "https://media.tenor.com/7wA-N7uaDVcAAAAj/zan-rui-zhanrui.gif") {
          // Check if the selected image URL matches the expected URL
          console.log("GIF selected. Playing bark sound...");
    
          const sound = new Howl({
            src: ["src/lib/pages/home/bark.mp3"], // Bark sound for "doge"
            volume: 0.5, // Adjust the volume here (0.5 means 50% volume)
          });
    
          // Play the "bark.mp3" sound
          sound.play();
          console.log("Sound played.");
        } else {
          // For all other cases, play "sfx.mp3"
          console.log("Other image selected. Playing sfx sound...");
          
          const sound = new Howl({
            src: ["src/lib/pages/home/sfx.mp3"], // SFX sound for all other options
            volume: 0.5, // Adjust the volume here (0.5 means 50% volume)
          });
    
          // Play the "sfx.mp3" sound
          sound.play();
          console.log("SFX Sound played.");
        }
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }, [props.logo]);
    

  return <Image src={props.logo} {...props} />;
};
