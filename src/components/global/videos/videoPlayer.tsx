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
}

const textTracks = [
  {
    src: "https://files.vidstack.io/sprite-fight/subs/english.vtt",
    label: "English",
    language: "en-US",
    kind: "subtitles",
    type: "vtt",
    default: true,
  },
  {
    src: "https://files.vidstack.io/sprite-fight/subs/spanish.vtt",
    label: "Spanish",
    language: "es-ES",
    kind: "subtitles",
    type: "vtt",
  },
  {
    src: "https://files.vidstack.io/sprite-fight/chapters.vtt",
    language: "en-US",
    kind: "chapters",
    type: "vtt",
    default: true,
  },
];

const VideoPlayer = ({ video, fn, thumbnail, title }: Props) => {
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
      className="w-full top-0 h-full object-cover relative"
      src={video}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      playsInline
      title={title}
      poster={thumbnail}
    >
      <MediaProvider></MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
