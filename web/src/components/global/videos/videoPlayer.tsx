"use client";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

interface Props {
  video: string;
  fn: Record<string, Function>;
  thumbnail: string;
  title: string;
  duration?:number
}



const VideoPlayer = ({ video, fn, thumbnail, title,duration }: Props) => {
  let type:any="video/"+video?.split('.')?.pop()?.split('#')?.[0]||"mp4";
  
  
  return (
    <MediaPlayer
      onTimeUpdate={(e) => {
        fn.onTimeUpdate(e);
      }}
      onPlay={(e) => {
        fn.onPlay();
      }}
      onPause={(e) => {
        fn.onPause();
      }}
      className=" rounded-lg aspect-video z-[0] object-cover relative"
      src={{src:video,type:type}}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      
      playsInline
      fullscreenOrientation="landscape"
      title={title}
      poster={thumbnail}
      {...(duration)&&{
        duration:duration/1000000+1
      }}
    >
      <MediaProvider></MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
